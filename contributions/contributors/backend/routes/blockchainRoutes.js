const express = require("express");
const notcoinTokenValidator = require("../middleware/notcoinTokenMiddleware");
const Transaction = require("../models/Transaction");
const Wallet = require("../models/Wallet"); // New Wallet model

const router = express.Router();

/**
 * Utility function for standardised responses.
 * @param {Object} res - Express response object.
 * @param {number} status - HTTP status code.
 * @param {string} message - Response message.
 * @param {Object} [data={}] - Additional data for the response.
 */
const handleResponse = (res, status, message, data = {}) => {
  res.status(status).json({
    success: status < 400,
    message,
    ...data,
  });
};

/**
 * @route   GET /transaction-history
 * @desc    Fetch transaction history for a wallet
 * @access  Blockchain Protected
 */
router.get("/transaction-history", notcoinTokenValidator(), async (req, res) => {
  const { walletAddress } = req.query;

  if (!walletAddress) {
    return handleResponse(res, 400, "Wallet address is required.");
  }

  try {
    const transactions = await Transaction.find({ walletAddress })
      .sort({ date: -1 })
      .limit(50);

    if (!transactions.length) {
      return handleResponse(res, 404, "No transactions found for this wallet.");
    }

    handleResponse(res, 200, "Transaction history retrieved successfully.", { transactions });
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    handleResponse(res, 500, "Internal server error. Please try again later.");
  }
});

/**
 * @route   POST /transfer
 * @desc    Transfer Notcoin tokens between wallets
 * @access  Blockchain Protected
 */
router.post("/transfer", notcoinTokenValidator(), async (req, res) => {
  const { senderWalletAddress, recipientWalletAddress, amount } = req.body;

  if (!senderWalletAddress || !recipientWalletAddress || !amount) {
    return handleResponse(res, 400, "Sender wallet, recipient wallet, and amount are required.");
  }

  try {
    // Fetch sender and recipient wallets
    const senderWallet = await Wallet.findOne({ address: senderWalletAddress });
    const recipientWallet = await Wallet.findOne({ address: recipientWalletAddress });

    if (!senderWallet || !recipientWallet) {
      return handleResponse(res, 404, "One or both wallet addresses are invalid.");
    }

    if (senderWallet.balance < amount) {
      return handleResponse(res, 400, "Insufficient Notcoin balance in sender's wallet.");
    }

    // Update wallet balances
    senderWallet.balance -= amount;
    recipientWallet.balance += amount;

    await senderWallet.save();
    await recipientWallet.save();

    // Log the transaction
    const transaction = await Transaction.create({
      walletAddress: senderWalletAddress,
      type: "Transfer",
      amount,
      recipient: recipientWalletAddress,
      date: new Date(),
    });

    handleResponse(res, 200, "Transfer successful.", { transaction });
  } catch (error) {
    console.error("Error during transfer:", error);
    handleResponse(res, 500, "Internal server error. Please try again later.");
  }
});

/**
 * @route   GET /wallet-summary
 * @desc    Fetch wallet summary including balance and recent transactions
 * @access  Blockchain Protected
 */
router.get("/wallet-summary", notcoinTokenValidator(), async (req, res) => {
  const { walletAddress } = req.query;

  if (!walletAddress) {
    return handleResponse(res, 400, "Wallet address is required.");
  }

  try {
    // Fetch wallet data
    const wallet = await Wallet.findOne({ address: walletAddress });
    if (!wallet) {
      return handleResponse(res, 404, "Wallet not found.");
    }

    // Fetch recent transactions
    const transactions = await Transaction.find({ walletAddress })
      .sort({ date: -1 })
      .limit(10);

    handleResponse(res, 200, "Wallet summary retrieved successfully.", {
      wallet: {
        address: wallet.address,
        balance: wallet.balance,
      },
      transactions,
    });
  } catch (error) {
    console.error("Error fetching wallet summary:", error);
    handleResponse(res, 500, "Internal server error. Please try again later.");
  }
});

module.exports = router;
