/**
 * models/Contribution.js
 * MongoDB schema for managing contributions in the Notfall Contributors system.
 * Handles contributor submissions, reward calculations, and status updates.
 */

const mongoose = require("mongoose");

const contributionSchema = new mongoose.Schema(
  {
    contributorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contributor",
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
    date: {
      type: Date,
      default: Date.now, // Automatically set to the current date
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    rewardTokens: {
      type: Number,
      default: 0, // Default reward tokens set to 0
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

/**
 * Method to calculate reward tokens based on complexity and impact scores.
 * @returns {Number} - The calculated reward tokens.
 */
contributionSchema.methods.calculateRewardTokens = function () {
  const baseReward = 10; // Base reward in tokens
  const complexityMultiplier = this.complexityScore * 2; // Complexity influences reward
  const impactMultiplier = this.impactScore * 3; // Impact influences reward
  const categoryBonus = this.category === "Feature Development" ? 5 : 0; // Bonus for specific categories

  return baseReward + complexityMultiplier + impactMultiplier + categoryBonus;
};

/**
 * Method to reward tokens to the contributor for a successful contribution.
 * Updates the contributor's wallet balance and the contribution status.
 * @returns {Object} - Object containing rewarded tokens and updated contributor details.
 */
contributionSchema.methods.rewardContributor = async function () {
  const Contributor = mongoose.model("Contributor"); // Dynamically import Contributor to avoid circular dependency

  // Calculate tokens
  const tokens = this.calculateRewardTokens();

  // Fetch contributor details
  const contributor = await Contributor.findById(this.contributorId);
  if (!contributor) {
    throw new Error("Contributor not found");
  }

  // Update contributor's wallet balance
  contributor.wallet.balance += tokens;

  // Update contribution status and reward tokens
  this.rewardTokens = tokens;
  this.status = "Approved";

  // Save updates to both the contributor and contribution
  await contributor.save();
  await this.save();

  return { tokens, contributor };
};

/**
 * Middleware to ensure data integrity before saving.
 * Validates required fields and logs creation events.
 */
contributionSchema.pre("save", function (next) {
  if (!this.description || !this.category || !this.complexityScore || !this.impactScore) {
    throw new Error("Missing required fields for the contribution");
  }
  next();
});

module.exports = mongoose.model("Contribution", contributionSchema);
