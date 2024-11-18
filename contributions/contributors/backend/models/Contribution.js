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
  },
  { timestamps: true }
);

// Virtual to calculate total score
contributionSchema.virtual("totalScore").get(function () {
  return this.complexityScore + this.impactScore;
});

// Static method to find contributions by category
contributionSchema.statics.findByCategory = function (category) {
  return this.find({ category });
};

module.exports = mongoose.model("Contribution", contributionSchema);
