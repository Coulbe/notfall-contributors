/**
 * models/Contribution.js
 * MongoDB schema for managing contributions in the Notfall Contributors system.
 * Features include:
 * - Contributor submissions
 * - Reward calculations and Notcoin integration
 * - Status updates and validations
 * - Task linking and GitHub issue tracking
 */

const mongoose = require("mongoose");

// Define the Contribution schema
const contributionSchema = new mongoose.Schema(
  {
    contributorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contributor", // Links to the Contributor model
      required: [true, "Contributor ID is required"],
    },
    description: {
      type: String,
      required: [true, "Contribution description is required"],
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Bug Fix", "Feature Development", "Documentation", "Other"],
    },
    subcategory: {
      type: String,
      maxlength: [100, "Subcategory cannot exceed 100 characters"],
      default: null,
    },
    complexityScore: {
      type: Number,
      required: [true, "Complexity score is required"],
      min: [1, "Complexity score must be at least 1"],
      max: [5, "Complexity score cannot exceed 5"],
    },
    impactScore: {
      type: Number,
      required: [true, "Impact score is required"],
      min: [1, "Impact score must be at least 1"],
      max: [5, "Impact score cannot exceed 5"],
    },
    githubIssue: {
      issueNumber: { type: Number, default: null }, // Tracks linked GitHub issue
      url: { type: String, default: null }, // GitHub issue URL
    },
    linkedTask: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task", // Links to a specific Task
      default: null,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    rewardTokens: {
      type: Number,
      default: 0, // Initial reward token value
    },
    notcoinsEarned: {
      type: Number,
      default: 0, // Total Notcoins earned for this contribution
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

/**
 * Calculates reward tokens for a contribution.
 * The calculation considers complexity, impact, and category-specific bonuses.
 * @returns {Number} - Calculated reward tokens.
 */
contributionSchema.methods.calculateRewardTokens = function () {
  const baseReward = 10; // Base reward for all contributions
  const complexityMultiplier = this.complexityScore * 2; // Multiplier for complexity
  const impactMultiplier = this.impactScore * 3; // Multiplier for impact
  const categoryBonus = this.category === "Feature Development" ? 5 : 0; // Extra reward for feature contributions

  return baseReward + complexityMultiplier + impactMultiplier + categoryBonus;
};

/**
 * Rewards the contributor for an approved contribution.
 * Updates the contributor's wallet and marks the contribution as approved.
 * @returns {Object} - Details of the rewarded tokens and updated contributor.
 */
contributionSchema.methods.rewardContributor = async function () {
  const Contributor = mongoose.model("Contributor"); // Avoid circular dependency
  const tokens = this.calculateRewardTokens();

  const contributor = await Contributor.findById(this.contributorId);
  if (!contributor) {
    throw new Error("Contributor not found");
  }

  // Update contributor's rewards and achievements
  contributor.rewards.notcoins += tokens;
  contributor.rewards.achievements.push(
    `Earned ${tokens} Notcoins for ${this.category}`
  );

  // Update contribution details
  this.rewardTokens = tokens;
  this.notcoinsEarned = tokens;
  this.status = "Approved";

  await contributor.save();
  await this.save();

  return { tokens, contributor };
};

/**
 * Middleware to validate essential fields before saving a contribution.
 */
contributionSchema.pre("save", function (next) {
  if (!this.description || !this.category || !this.complexityScore || !this.impactScore) {
    throw new Error("Missing required fields for the contribution.");
  }
  next();
});

/**
 * Static method to fetch contributions by status.
 * @param {String} status - Contribution status (e.g., "Pending", "Approved").
 * @returns {Array} - List of contributions matching the status.
 */
contributionSchema.statics.findByStatus = async function (status) {
  return await this.find({ status });
};

/**
 * Virtual field to get a concise summary of the contribution.
 * @returns {String} - Summary string.
 */
contributionSchema.virtual("summary").get(function () {
  return `${this.category} contribution by contributor ID ${this.contributorId}`;
});

/**
 * Static method to link a GitHub issue with a contribution.
 * @param {Object} contribution - Contribution object.
 * @param {Object} githubIssue - GitHub issue details.
 */
contributionSchema.statics.linkGitHubIssue = async function (contribution, githubIssue) {
  contribution.githubIssue.issueNumber = githubIssue.number;
  contribution.githubIssue.url = githubIssue.html_url;
  await contribution.save();
};

module.exports = mongoose.model("Contribution", contributionSchema);
