const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["Transfer", "Deposit", "Withdrawal"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  recipient: {
    type: String,
  },
  sender: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Transaction", transactionSchema);
