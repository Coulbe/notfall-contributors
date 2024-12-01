const mongoose = require("mongoose");
const geoip = require("geoip-lite"); // For IP geolocation tracking

/**
 * AuditLog Schema
 * Tracks user actions within the Notfall system.
 * Features include:
 * - IP address logging
 * - Geolocation data
 * - Suspicious activity flagging
 * - Resource-specific logging
 */
const AuditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      enum: ["CREATE", "UPDATE", "DELETE", "LOGIN", "LOGOUT", "ACCESS"],
    },
    resource: {
      type: String,
      required: true, // The resource affected by the action, e.g., "Task", "Folder"
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "resource", // Dynamically references the resource model
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Links the log to a specific user
      required: true,
    },
    ipAddress: {
      type: String,
      required: true, // Logs the IP address of the user
    },
    location: {
      country: { type: String },
      city: { type: String },
      region: { type: String },
      latitude: { type: Number },
      longitude: { type: Number },
    },
    isSuspicious: {
      type: Boolean,
      default: false, // Flags the action as suspicious based on predefined rules
    },
    details: {
      type: mongoose.Schema.Types.Mixed, // Additional metadata about the action
      default: {},
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt timestamps
);

/**
 * Middleware to track geolocation based on IP address.
 */
AuditLogSchema.pre("save", function (next) {
  if (this.ipAddress) {
    const geo = geoip.lookup(this.ipAddress);
    if (geo) {
      this.location = {
        country: geo.country,
        city: geo.city,
        region: geo.region,
        latitude: geo.ll[0],
        longitude: geo.ll[1],
      };
    }
  }

  // Mark activity as suspicious if IP is from an unexpected region or other logic
  if (this.action === "LOGIN" && this.location.country !== "ExpectedCountry") {
    this.isSuspicious = true;
  }

  next();
});

/**
 * Static method to retrieve suspicious logs.
 * @returns {Promise} - Logs marked as suspicious
 */
AuditLogSchema.statics.findSuspiciousActivities = async function () {
  return await this.find({ isSuspicious: true }).populate("userId", "username email");
};

/**
 * Static method to log an action.
 * @param {Object} logData - Data for the log entry
 * @returns {Promise} - Saved log entry
 */
AuditLogSchema.statics.logAction = async function (logData) {
  const { userId, action, resource, resourceId, ipAddress, details } = logData;

  const newLog = new this({
    userId,
    action,
    resource,
    resourceId,
    ipAddress,
    details,
  });

  return await newLog.save();
};

/**
 * Virtual field to get full resource details.
 */
AuditLogSchema.virtual("resourceDetails", {
  refPath: "resource", // Dynamically reference the resource model
  localField: "resourceId",
  foreignField: "_id",
  justOne: true,
});

/**
 * Post-save hook to notify admins of suspicious activity.
 */
AuditLogSchema.post("save", async function (doc) {
  if (doc.isSuspicious) {
    // Notify admins via a service or webhook
    const NotificationService = require("../services/notificationService");
    await NotificationService.sendAdminAlert(
      `Suspicious activity detected for user ${doc.userId}. Action: ${doc.action}, IP: ${doc.ipAddress}.`
    );
  }
});

module.exports = mongoose.model("AuditLog", AuditLogSchema);

