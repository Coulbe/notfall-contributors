const mongoose = require("mongoose");

/**
 * User Schema
 * A unified schema for managing all user types within the Notfall system.
 */
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      enum: [
        "Admin",
        "Engineer",
        "Contributor",
        "Property Manager",
        "Tenant",
        "Homeowner",
        "Business",
      ],
      required: [true, "User role is required"],
    },
    profile: {
      name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
      },
      phone: {
        type: String,
        trim: true,
        default: null,
      },
      address: {
        type: String,
        trim: true,
        default: null,
      },
    },
    skills: {
      type: [String], // Skills applicable for contributors or engineers
      default: [],
    },
    companyDetails: {
      companyName: {
        type: String,
        trim: true,
        default: null, // For businesses only
      },
      companyRegistration: {
        type: String,
        trim: true,
        default: null,
      },
    },
    assignedTasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task", // Reference to the Task model
      },
    ],
    managedProperties: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property", // Reference to properties for property managers
      },
    ],
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude] for engineers or businesses
        default: undefined,
      },
    },
    availability: [
      {
        date: { type: Date },
        timeSlots: { type: [String] }, // Available time slots for engineers
      },
    ],
    status: {
      type: String,
      enum: ["Active", "Inactive", "Suspended"],
      default: "Active",
    },
    notifications: [
      {
        message: { type: String, required: true },
        read: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    rewards: {
      notcoins: { type: Number, default: 0 }, // Notcoin balance for contributors or engineers
      achievements: { type: [String], default: [] }, // Achievements or badges
    },
    auditLogs: [
      {
        event: { type: String, required: true }, // Event description
        timestamp: { type: Date, default: Date.now }, // Time of the event
      },
    ],
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

/**
 * Middleware to log actions on user creation or updates.
 */
userSchema.pre("save", function (next) {
  if (this.isNew) {
    this.auditLogs.push({ event: "User Created" });
  } else {
    this.auditLogs.push({ event: "User Updated" });
  }
  next();
});

/**
 * Static method to fetch users by role.
 * @param {String} role - User role (e.g., "Engineer", "Contributor").
 * @returns {Promise} - List of users for the specified role.
 */
userSchema.statics.findByRole = async function (role) {
  return await this.find({ role });
};

/**
 * Static method to fetch users by status.
 * @param {String} status - User status (e.g., "Active").
 * @returns {Promise} - List of users with the specified status.
 */
userSchema.statics.findByStatus = async function (status) {
  return await this.find({ status });
};

/**
 * Virtual field to get full address for a user.
 * @returns {String} - Full address string.
 */
userSchema.virtual("fullAddress").get(function () {
  return `${this.profile.address || ""}, ${this.location?.coordinates?.join(", ") || ""}`;
});

module.exports = mongoose.model("User", userSchema);
