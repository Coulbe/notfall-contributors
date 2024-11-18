const contributorSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Hashed password
    wallet: {
      address: { type: String, required: true },
      balance: { type: Number, default: 0 }, // Total token balance
    },
    roles: [{ type: String, enum: ["Contributor", "Admin", "ProjectManager"], default: "Contributor" }],
    contributions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Contribution" }],
    activityLog: [
      {
        activity: { type: String },
        date: { type: Date, default: Date.now },
      },
    ],
    lastActive: { type: Date },
  },
  { timestamps: true }
);

// Method to deduct tokens (useful for transfers or penalties)
contributorSchema.methods.deductTokens = async function (amount) {
  if (this.wallet.balance < amount) {
    throw new Error("Insufficient token balance");
  }

  this.wallet.balance -= amount;
  return this.save();
};

module.exports = mongoose.model("Contributor", contributorSchema);

