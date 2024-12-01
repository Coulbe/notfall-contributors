/**
 * models/GitHubIssue.js
 * Schema for creating and tracking GitHub Issues and linking them to contributors, roles, and folders within the Notfall system.
 */

const mongoose = require("mongoose");

const GitHubIssueSchema = new mongoose.Schema(
  {
    issueNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    labels: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved", "Closed"],
      default: "Open",
    },
    comments: {
      type: [String],
      default: [],
    },
    linkedContributor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Links to the User model
    },
    role: {
      type: String,
      enum: ["Contributor", "Engineer", "Admin"],
      required: true,
    },
    folderAccess: {
      type: String,
      required: true,
      trim: true,
    },
    linkedTask: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task", // Links to the Task model
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

/**
 * Middleware to update the `updatedAt` timestamp before each save.
 */
GitHubIssueSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

/**
 * Static method to find issues by status.
 * @param {String} status - Status of the GitHub issue (e.g., "Open").
 * @returns {Promise} - List of issues with the specified status.
 */
GitHubIssueSchema.statics.findByStatus = async function (status) {
  return await this.find({ status });
};

/**
 * Static method to find issues by contributor.
 * @param {ObjectId} contributorId - The ID of the linked contributor.
 * @returns {Promise} - List of issues linked to the specified contributor.
 */
GitHubIssueSchema.statics.findByContributor = async function (contributorId) {
  return await this.find({ linkedContributor: contributorId });
};

/**
 * Virtual field to get the full GitHub issue URL.
 * @returns {String} - The GitHub issue URL.
 */
GitHubIssueSchema.virtual("issueUrl").get(function () {
  return `https://github.com/Coulbe/notfall-contributors/issues/${this.issueNumber}`;
});

module.exports = mongoose.model("GitHubIssue", GitHubIssueSchema);
