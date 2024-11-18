const mongoose = require("mongoose");

const contributionSchema = new mongoose.Schema(
  {
    contributorId: { type: mongoose.Schema.Types.ObjectId, ref: "Contributor", required: true },
    description: { type: String, required: true },
    category: { type: String, required: true, enum: ["Bug Fix", "Feature Development", "Documentation", "Other"] },
    subcategory: { type: String },
    complexityScore: { type: Number, required: true, min: 1, max: 5 },
    impactScore: { type: Number, required: true, min: 1, max: 5 },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
    rewardTokens: { type: Number, default: 0 }, // Tokens rewarded for this contribution
  },
  { timestamps: true }
);

// Method to calculate tokens based on complexity and impact
contributionSchema.methods.calculateRewardTokens = function () {
  let baseReward = 10; // Base reward in tokens
  let complexityMultiplier = this.complexityScore * 2; // Complexity influences reward
  let impactMultiplier = this.impactScore * 3; // Impact influences reward
  let categoryBonus = this.category === "Feature Development" ? 5 : 0; // Bonus for specific categories

  return baseReward + complexityMultiplier + impactMultiplier + categoryBonus;
};

// Method to reward tokens to the contributor
contributionSchema.methods.rewardContributor = async function () {
  const Contributor = mongoose.model("Contributor"); // Dynamically import Contributor to avoid circular dependency

  const tokens = this.calculateRewardTokens();
  const contributor = await Contributor.findById(this.contributorId);

  if (!contributor) {
    throw new Error("Contributor not found");
  }

  // Update contributor's wallet balance and save
  contributor.wallet.balance += tokens;
  this.rewardTokens = tokens;
  this.status = "Approved";

  await contributor.save();
  await this.save();

  return { tokens, contributor };
};

module.exports = mongoose.model("Contribution", contributionSchema);
