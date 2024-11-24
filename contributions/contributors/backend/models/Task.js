const mongoose = require("mongoose");

/**
 * Task Schema
 * A unified schema for managing tasks across engineers, contributors, and tenants in the Notfall system.
 */
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
    },
    description: {
      type: String,
      required: [true, "Task description is required"],
    },
    role: {
      type: String,
      enum: [
        "Engineer",
        "Backend Developer",
        "Frontend Developer",
        "Full-Stack Developer",
        "Blockchain Developer",
        "DevOps Engineer",
        "Admin",
        "Tenant",
        "Property Manager",
      ],
      required: [true, "Task role is required"],
    },
    requiredSkills: {
      type: [String], // Skills required for the task
      default: [],
    },
    folderAccess: {
      type: [String], // Folder/file paths accessible for this task
      default: [],
    },
    tags: {
      type: [String], // Keywords for task categorization
      default: [],
    },
    reward: {
      type: Number, // Number of Notcoins or points rewarded for this task
      default: 0,
      min: [0, "Reward must be a positive number"],
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: [
        "Unassigned",
        "Pending Approval",
        "Approved",
        "In Progress",
        "Completed",
        "Rejected",
        "Archived",
      ],
      default: "Unassigned",
    },
    roleReference: {
      type: String,
      enum: ["Contributor", "Engineer", "User"], // Reference entity
      required: [true, "Role reference is required"],
    },
    raisedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // User who raised the task (e.g., Tenant)
      default: null,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Property Manager who approved the task
      default: null,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the assigned entity
      refPath: "roleReference",
      default: null,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: undefined, // Only applicable for engineer tasks
      },
    },
    hourlyRate: {
      type: Number, // Applicable for engineer tasks
      default: null,
    },
    dueDate: {
      type: Date, // Optional deadline for the task
      default: null,
    },
    completionDate: {
      type: Date, // Date when the task was completed
      default: null,
    },
    approvedAt: {
      type: Date, // Date when the task was approved by a property manager
      default: null,
    },
    auditLogs: [
      {
        event: { type: String, required: true }, // Event description (e.g., "Task Created", "Status Updated")
        timestamp: { type: Date, default: Date.now }, // Time of the event
        performedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Who performed the event
      },
    ],
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

/**
 * Middleware to add default audit log when a task is created.
 */
taskSchema.pre("save", function (next) {
  if (this.isNew) {
    this.auditLogs.push({
      event: "Task Created",
      performedBy: this.raisedBy || null,
    });
  }
  next();
});

/**
 * Method to update task status and log the event.
 * @param {String} status - New status for the task.
 * @param {ObjectId} userId - User making the update.
 * @returns {Promise} - Updated task.
 */
taskSchema.methods.updateStatus = async function (status, userId) {
  this.status = status;
  this.auditLogs.push({
    event: `Status updated to '${status}'`,
    performedBy: userId,
  });
  return this.save();
};

/**
 * Static method to fetch tasks by role.
 * @param {String} role - Role (e.g., "Engineer", "Contributor", "Tenant").
 * @returns {Promise} - List of tasks for the specified role.
 */
taskSchema.statics.findByRole = async function (role) {
  return await this.find({ role });
};

/**
 * Static method to find tasks by status.
 * @param {String} status - Task status (e.g., "Pending", "Completed").
 * @returns {Promise} - List of tasks with the specified status.
 */
taskSchema.statics.findByStatus = async function (status) {
  return await this.find({ status });
};

/**
 * Virtual field to calculate the time remaining for a task.
 * @returns {Number | null} - Time remaining in milliseconds or null if no dueDate.
 */
taskSchema.virtual("timeRemaining").get(function () {
  if (!this.dueDate) return null;
  const now = new Date();
  return Math.max(0, this.dueDate.getTime() - now.getTime());
});

module.exports = mongoose.model("Task", taskSchema);
