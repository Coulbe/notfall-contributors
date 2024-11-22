const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Contributor" },
    folderId: { type: mongoose.Schema.Types.ObjectId, ref: "Folder" },
    status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    dueDate: { type: Date },
  },
  { timestamps: true }
);

// Method to update task status
taskSchema.methods.updateStatus = function (status) {
  this.status = status;
  return this.save();
};

// Static method to find tasks by status
taskSchema.statics.findByStatus = function (status) {
  return this.find({ status });
};

module.exports = mongoose.model("Task", taskSchema);

/**
 * models/Task.js
 * MongoDB schema for managing tasks in the Notfall Contributors system.
 */

const mongoose = require("mongoose");

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
      enum: ["Backend Developer", "Frontend Developer", "Full-Stack Developer", "Blockchain Developer", "DevOps Engineer", "Admin"],
      required: [true, "Task role is required"],
    },
    folderAccess: {
      type: [String], // Array of folder/file paths accessible for this task
      required: [true, "Folder access paths are required"],
    },
    tags: {
      type: [String], // Keywords for task categorization
      default: [],
    },
    reward: {
      type: Number, // Number of Notcoins or points rewarded for this task
      required: [true, "Task reward is required"],
      min: [0, "Reward must be a positive number"],
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["Unassigned", "In Progress", "Completed", "Archived"],
      default: "Unassigned",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the Contributor assigned to this task
      ref: "Contributor",
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the Admin or system creating the task
      ref: "User",
      default: null,
    },
    dueDate: {
      type: Date,
      default: null, // Optional deadline for the task
    },
    completionDate: {
      type: Date,
      default: null, // Date when the task was completed
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

// Middleware to add default audit log when a task is created
taskSchema.pre("save", function (next) {
  if (this.isNew) {
    this.auditLogs.push({
      event: "Task Created",
      performedBy: this.createdBy || null,
    });
  }
  next();
});

// Static method to fetch tasks by role
taskSchema.statics.findByRole = async function (role) {
  return await this.find({ role });
};

// Virtual field to calculate the time remaining for a task
taskSchema.virtual("timeRemaining").get(function () {
  if (!this.dueDate) return null;
  const now = new Date();
  return Math.max(0, this.dueDate.getTime() - now.getTime());
});

module.exports = mongoose.model("Task", taskSchema);

