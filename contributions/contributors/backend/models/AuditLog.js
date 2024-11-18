const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    action: { type: String, required: true, enum: ["CREATE", "UPDATE", "DELETE"] },
    resource: { type: String, required: true }, // E.g., "Folder", "Contributor"
    resourceId: { type: mongoose.Schema.Types.ObjectId, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Contributor", required: true },
    details: { type: mongoose.Schema.Types.Mixed }, // Additional metadata for the action
  },
  { timestamps: true }
);

// Virtual to populate resource details
auditLogSchema.virtual("resourceDetails", {
  refPath: "resource", // Dynamic reference to the resource model
  localField: "resourceId",
  foreignField: "_id",
  justOne: true,
});

module.exports = mongoose.model("AuditLog", auditLogSchema);
