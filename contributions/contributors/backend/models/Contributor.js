const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const contributorSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Hashed password
    wallet: {
      address: { type: String, required: true },
      balance: { type: Number, default: 0 },
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

// Middleware to hash passwords before saving
contributorSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to verify password
contributorSchema.methods.verifyPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Static method to fetch contributors with roles
contributorSchema.statics.findByRole = function (role) {
  return this.find({ roles: role });
};

module.exports = mongoose.model("Contributor", contributorSchema);
