/**
 * models/NotcoinWallet.js
 * A comprehensive model for managing Notcoin wallets, token minting, SLA deductions, and blockchain integration.
 */

const mongoose = require("mongoose");
const blockchainService = require("../services/blockchainService");

const TOTAL_SUPPLY = 20000000; // Total Notcoin supply
const RESERVED_TOKENS = TOTAL_SUPPLY * 0.51; // 51% reserved for governance
const MINTABLE_TOKENS = TOTAL_SUPPLY - RESERVED_TOKENS; // 49% mintable
let mintedTokens = 0; // Tracks total dynamically minted tokens

const notcoinWalletSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    walletAddress: {
      type: String, // Blockchain wallet address
      required: true,
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
    },
    transactionHistory: [
      {
        transactionType: {
          type: String,
          enum: ["Reward", "Deduction", "Transfer", "Payment", "Mining"],
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
        description: {
          type: String,
          default: "",
        },
        txHash: { type: String }, // Blockchain transaction hash
        validator: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Validator ID
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

/**
 * Calculate the reward tokens for a task dynamically.
 * Factors include task complexity, impact, urgency, and validator fees.
 * @param {Object} task - Task object containing details like complexity, impact, and urgency.
 * @returns {Object} - Calculated tokens and validator fee.
 */
notcoinWalletSchema.statics.calculateTokens = function (task) {
  const baseReward = 10;
  const complexityMultiplier = task.complexity * 2;
  const impactMultiplier = task.impact * 3;
  const urgencyMultiplier = task.urgency === "High" ? 2 : task.urgency === "Medium" ? 1.5 : 1;

  const totalReward = baseReward + complexityMultiplier + impactMultiplier;
  const validatorFee = totalReward * 0.01; // 1% for validators
  const tokens = totalReward * urgencyMultiplier - validatorFee;

  if (mintedTokens + tokens > MINTABLE_TOKENS) {
    throw new Error("Mintable token limit exceeded.");
  }

  return { tokens, validatorFee };
};

/**
 * Mint tokens for task completion after validator confirmation.
 * @param {Object} task - Task details.
 * @param {Object} validator - Validator who confirmed the task.
 */
notcoinWalletSchema.methods.mintTokensForTask = async function (task, validator) {
  const { tokens, validatorFee } = this.constructor.calculateTokens(task);

  const txHash = await blockchainService.mintTokens(this.walletAddress, tokens);
  const validatorTxHash = await blockchainService.rewardValidator(
    validator.walletAddress,
    validatorFee
  );

  this.balance += tokens;
  mintedTokens += tokens;

  this.transactionHistory.push({
    transactionType: "Reward",
    amount: tokens,
    description: `Task reward for task ID: ${task._id}`,
    txHash,
  });

  validator.transactionHistory.push({
    transactionType: "Mining",
    amount: validatorFee,
    description: `Validator reward for task ID: ${task._id}`,
    txHash: validatorTxHash,
  });

  await validator.save();
  return await this.save();
};

/**
 * Deduct tokens for SLA violations.
 * @param {Number} amount - Amount to deduct.
 * @param {String} description - Reason for the deduction.
 */
notcoinWalletSchema.methods.deductTokens = async function (amount, description = "Deduction") {
  if (amount <= 0) {
    throw new Error("Deduction amount must be greater than zero.");
  }

  if (this.balance < amount) {
    throw new Error("Insufficient balance for deduction.");
  }

  const txHash = await blockchainService.burnTokens(this.walletAddress, amount);

  this.balance -= amount;
  this.transactionHistory.push({
    transactionType: "Deduction",
    amount,
    description,
    txHash,
  });

  return await this.save();
};

/**
 * Transfer tokens between wallets.
 * @param {String} recipientWalletAddress - Recipient's wallet address.
 * @param {Number} amount - Amount to transfer.
 * @param {String} description - Reason for the transfer.
 */
notcoinWalletSchema.methods.transferTokens = async function (
  recipientWalletAddress,
  amount,
  description = "Transfer"
) {
  if (amount <= 0) {
    throw new Error("Transfer amount must be greater than zero.");
  }

  if (this.balance < amount) {
    throw new Error("Insufficient balance for transfer.");
  }

  const txHash = await blockchainService.transferTokens(
    this.walletAddress,
    recipientWalletAddress,
    amount
  );

  this.balance -= amount;
  this.transactionHistory.push({
    transactionType: "Transfer",
    amount,
    description,
    txHash,
  });

  return await this.save();
};

module.exports = mongoose.model("NotcoinWallet", notcoinWalletSchema);
