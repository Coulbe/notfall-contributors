/**
 * models/Notification.js
 * Schema for tracking notifications in the Notfall system.
 */

const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["TaskAssigned", "TaskCompleted", "RewardIssued", "General"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    link: {
      type: String, // Link to related task, reward, or general information
    },
    read: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notification", notificationSchema);
