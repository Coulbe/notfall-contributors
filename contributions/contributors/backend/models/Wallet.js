const mongoose = require("mongoose");
const Web3 = require("web3");

const web3 = new Web3(); // Instance of Web3 for Ethereum address validation

const walletSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (value) {
        return web3.utils.isAddress(value); // Validate Ethereum-like address
      },
      message: (props) => `${props.value} is not a valid Ethereum-like wallet address!`,
    },
  },
  balance: {
    type: Number,
    required: true,
    default: 0,
    min: [0, "Wallet balance cannot be negative."],
  },
  ownerName: {
    type: String,
    required: true,
    minlength: [3, "Owner name must be at least 3 characters long."],
    maxlength: [100, "Owner name cannot exceed 100 characters."],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to automatically update `updatedAt` before saving
walletSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

/**
 * Instance method to add funds to the wallet.
 * @param {number} amount - The amount to add.
 * @returns {Promise<Wallet>} - The updated wallet instance.
 */
walletSchema.methods.addFunds = async function (amount) {
  if (amount <= 0) throw new Error("Amount must be greater than 0.");
  this.balance += amount;
  await this.save();
  return this;
};

/**
 * Instance method to deduct funds from the wallet.
 * @param {number} amount - The amount to deduct.
 * @returns {Promise<Wallet>} - The updated wallet instance.
 */
walletSchema.methods.deductFunds = async function (amount) {
  if (amount <= 0) throw new Error("Amount must be greater than 0.");
  if (this.balance < amount) throw new Error("Insufficient balance.");
  this.balance -= amount;
  await this.save();
  return this;
};

/**
 * Instance method to deactivate the wallet.
 * @returns {Promise<Wallet>} - The deactivated wallet instance.
 */
walletSchema.methods.deactivate = async function () {
  this.isActive = false;
  await this.save();
  return this;
};

/**
 * Static method to find a wallet by its Ethereum-like address.
 * @param {string} address - The wallet address to search for.
 * @returns {Promise<Wallet|null>} - The found wallet or null if not found.
 */
walletSchema.statics.findByAddress = async function (address) {
  if (!web3.utils.isAddress(address)) {
    throw new Error("Invalid Ethereum-like address provided.");
  }
  return await this.findOne({ address });
};

/**
 * Static method to get all wallets with a minimum balance.
 * @param {number} minBalance - Minimum balance to filter wallets.
 * @returns {Promise<Array<Wallet>>} - Array of wallets meeting the criteria.
 */
walletSchema.statics.findWalletsByMinBalance = async function (minBalance) {
  return await this.find({ balance: { $gte: minBalance } });
};

/**
 * Static method to activate a wallet.
 * @param {string} address - The wallet address to activate.
 * @returns {Promise<Wallet|null>} - The activated wallet or null if not found.
 */
walletSchema.statics.activateWallet = async function (address) {
  const wallet = await this.findByAddress(address);
  if (!wallet) return null;
  wallet.isActive = true;
  await wallet.save();
  return wallet;
};

/**
 * Virtual property to check if the wallet is active and has a non-zero balance.
 * @returns {boolean} - True if active and non-empty, false otherwise.
 */
walletSchema.virtual("isEligibleForTransaction").get(function () {
  return this.isActive && this.balance > 0;
});

/**
 * Virtual property to get wallet's status.
 * @returns {string} - "Active" or "Inactive" based on wallet state.
 */
walletSchema.virtual("status").get(function () {
  return this.isActive ? "Active" : "Inactive";
});

/**
 * Static method to fetch wallets with a balance range.
 * @param {number} minBalance - Minimum balance.
 * @param {number} maxBalance - Maximum balance.
 * @returns {Promise<Array<Wallet>>} - Array of wallets within the balance range.
 */
walletSchema.statics.findWalletsByBalanceRange = async function (minBalance, maxBalance) {
  return await this.find({
    balance: { $gte: minBalance, $lte: maxBalance },
  });
};

/**
 * Static method to deactivate all inactive wallets with a zero balance.
 * @returns {Promise<number>} - Count of deactivated wallets.
 */
walletSchema.statics.deactivateZeroBalanceWallets = async function () {
  const result = await this.updateMany({ isActive: true, balance: 0 }, { isActive: false });
  return result.modifiedCount; // Returns the number of updated documents
};

module.exports = mongoose.model("Wallet", walletSchema);
