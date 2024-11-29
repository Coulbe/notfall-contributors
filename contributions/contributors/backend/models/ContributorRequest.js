/**
 * models/ContributorRequest.js
 * MongoDB schema for managing contributor requests in the Notfall Contributors system.
 * Captures details about contributor applications, including skills, experience, and areas of interest.
 */

const mongoose = require("mongoose");

const contributorRequestSchema = new mongoose.Schema(
  {
    githubUsername: {
      type: String,
      required: [true, "GitHub username is required"],
      unique: true, // Ensures each GitHub username is unique
      trim: true, // Removes leading and trailing whitespaces
      maxlength: [50, "GitHub username cannot exceed 50 characters"],
    },
    reason: {
      type: String,
      required: [true, "Reason for contributing is required"],
      maxlength: [500, "Reason cannot exceed 500 characters"],
    },
    areaOfInterest: {
      type: String,
      required: [true, "Area of interest is required"],
      enum: [
        "Backend Development",
        "Frontend Development",
        "Documentation",
        "Testing",
        "UI/UX Design",
        "Blockchain Integration",
        "Other",
      ], // Restricted to predefined areas of interest
    },
    experienceLevel: {
      type: String,
      required: [true, "Experience level is required"],
      enum: [
        "Beginner (Eager to learn)",
        "Intermediate (Some experience)",
        "Advanced (Independent contributor)",
        "Expert (Mentor level)",
      ], // Restricted to predefined experience levels
    },
    location: {
      type: String,
      trim: true, // Removes leading and trailing whitespaces
      maxlength: [100, "Location cannot exceed 100 characters"],
    },
    skills: {
      type: String,
      trim: true, // Removes leading and trailing whitespaces
      maxlength: [300, "Skills cannot exceed 300 characters"],
    },
    pastContributions: {
      type: String,
      trim: true, // Removes leading and trailing whitespaces
      maxlength: [500, "Past contributions cannot exceed 500 characters"],
    },
    additionalDetails: {
      type: String,
      trim: true, // Removes leading and trailing whitespaces
      maxlength: [500, "Additional details cannot exceed 500 characters"],
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending", // Default status for new requests
    },
    submittedAt: {
      type: Date,
      default: Date.now, // Automatically sets the submission timestamp
    },
    reviewedAt: {
      type: Date, // Optional field to record when the request was reviewed
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // References the admin or reviewer who handled the request
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

/**
 * Middleware to trim inputs before saving.
 */
contributorRequestSchema.pre("save", function (next) {
  this.githubUsername = this.githubUsername.trim();
  this.reason = this.reason.trim();
  if (this.location) this.location = this.location.trim();
  if (this.skills) this.skills = this.skills.trim();
  if (this.pastContributions) this.pastContributions = this.pastContributions.trim();
  if (this.additionalDetails) this.additionalDetails = this.additionalDetails.trim();
  next();
});

/**
 * Static method to fetch all pending requests.
 * @returns {Promise} - A promise that resolves to the list of pending contributor requests.
 */
contributorRequestSchema.statics.getPendingRequests = async function () {
  return this.find({ status: "Pending" });
};

/**
 * Instance method to approve the request.
 * @param {ObjectId} reviewerId - The ID of the user reviewing the request.
 */
contributorRequestSchema.methods.approveRequest = async function (reviewerId) {
  this.status = "Approved";
  this.reviewer = reviewerId;
  this.reviewedAt = new Date();
  return this.save();
};

/**
 * Instance method to reject the request.
 * @param {ObjectId} reviewerId - The ID of the user reviewing the request.
 */
contributorRequestSchema.methods.rejectRequest = async function (reviewerId) {
  this.status = "Rejected";
  this.reviewer = reviewerId;
  this.reviewedAt = new Date();
  return this.save();
};

module.exports = mongoose.model("ContributorRequest", contributorRequestSchema);
