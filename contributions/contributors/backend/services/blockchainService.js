/**
 * services/blockchainService.js
 * Handles interactions with the Notcoin smart contract on the blockchain.
 * This service ensures secure, efficient, and traceable operations, including token minting, distribution,
 * and governance protection for the founder's 51% token share.
 */

const Web3 = require("web3");
const contractABI = require("../config/contractABI.json");
const logger = require("../utils/logger");

// Environment variables for secure configuration
const PROVIDER_URL = process.env.BLOCKCHAIN_PROVIDER_URL;
const CONTRACT_ADDRESS = process.env.NOTCOIN_CONTRACT_ADDRESS;
const OWNER_PRIVATE_KEY = process.env.FOUNDER_PRIVATE_KEY;
const OWNER_ADDRESS = process.env.FOUNDER_WALLET_ADDRESS;

// Initialize Web3 instance
const web3 = new Web3(new Web3.providers.HttpProvider(PROVIDER_URL));

// Initialize the Notcoin contract instance
const contract = new web3.eth.Contract(contractABI, CONTRACT_ADDRESS);

/**
 * Utility function to create a signed transaction.
 * @param {Object} txData - Transaction data.
 * @returns {Object} - Transaction receipt.
 */
const sendSignedTransaction = async (txData) => {
  try {
    // Get the transaction count for the owner's wallet
    const txCount = await web3.eth.getTransactionCount(OWNER_ADDRESS);

    // Build the transaction object
    const txObject = {
      nonce: web3.utils.toHex(txCount),
      gasLimit: web3.utils.toHex(300000), // Adjust based on the transaction type
      gasPrice: web3.utils.toHex(web3.utils.toWei("20", "gwei")), // Gas price in gwei
      ...txData,
    };

    // Sign the transaction
    const signedTx = await web3.eth.accounts.signTransaction(txObject, OWNER_PRIVATE_KEY);

    // Send the transaction
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    logger.info(`Transaction successful: ${receipt.transactionHash}`);
    return receipt;
  } catch (error) {
    logger.error(`Error sending signed transaction: ${error.message}`);
    throw new Error("Blockchain transaction failed");
  }
};

/**
 * Mint Notcoin tokens.
 * Tokens are minted when a task is successfully completed.
 * @param {String} recipient - Address of the user receiving tokens.
 * @param {Number} amount - Amount of tokens to mint.
 * @returns {Object} - Transaction receipt.
 */
const mintTokens = async (recipient, amount) => {
  try {
    // Protect governance: Ensure 51% of the supply remains untouched
    const totalSupply = await contract.methods.totalSupply().call();
    const protectedSupply = await contract.methods.balanceOf(OWNER_ADDRESS).call();
    const mintableSupply = (totalSupply * 0.49) - (totalSupply - protectedSupply);

    if (amount > mintableSupply) {
      throw new Error("Minting amount exceeds the allowed supply for distribution");
    }

    // Build the transaction data
    const txData = {
      to: CONTRACT_ADDRESS,
      data: contract.methods.mint(recipient, web3.utils.toWei(amount.toString(), "ether")).encodeABI(),
    };

    // Send the transaction
    const receipt = await sendSignedTransaction(txData);
    return receipt;
  } catch (error) {
    logger.error(`Error minting tokens: ${error.message}`);
    throw new Error("Token minting failed");
  }
};

/**
 * Distribute Notcoins to validators and miners.
 * Validators ensure full-node task validation before tokens are issued.
 * @param {String} minerAddress - Address of the miner receiving rewards.
 * @param {String} validatorAddress - Address of the validator receiving rewards.
 * @param {Number} minerReward - Reward amount for the miner.
 * @param {Number} validatorReward - Reward amount for the validator.
 * @returns {Object} - Distribution receipts.
 */
const distributeMiningRewards = async (minerAddress, validatorAddress, minerReward, validatorReward) => {
  try {
    // Mint tokens for the miner
    const minerReceipt = await mintTokens(minerAddress, minerReward);

    // Mint tokens for the validator
    const validatorReceipt = await mintTokens(validatorAddress, validatorReward);

    return { minerReceipt, validatorReceipt };
  } catch (error) {
    logger.error(`Error distributing mining rewards: ${error.message}`);
    throw new Error("Mining rewards distribution failed");
  }
};

/**
 * Validate if a user wallet is eligible for token distribution.
 * @param {String} walletAddress - Address of the user's wallet.
 * @returns {Boolean} - Eligibility status.
 */
const validateWallet = async (walletAddress) => {
  try {
    const balance = await web3.eth.getBalance(walletAddress);
    return parseFloat(web3.utils.fromWei(balance, "ether")) > 0;
  } catch (error) {
    logger.error(`Error validating wallet: ${error.message}`);
    throw new Error("Wallet validation failed");
  }
};

/**
 * Governance: Secure the founder's 51% token share.
 * This ensures the founder retains control over governance-related tokens.
 * @returns {Boolean} - Protection status.
 */
const protectGovernanceTokens = async () => {
  try {
    const balance = await contract.methods.balanceOf(OWNER_ADDRESS).call();
    const totalSupply = await contract.methods.totalSupply().call();

    if (parseFloat(balance) < totalSupply * 0.51) {
      throw new Error("Governance tokens protection threshold breached");
    }

    logger.info("Governance tokens are secure");
    return true;
  } catch (error) {
    logger.error(`Error protecting governance tokens: ${error.message}`);
    throw new Error("Governance token protection failed");
  }
};

/**
 * Fetch the total supply of Notcoins.
 * @returns {String} - Total supply in Ether.
 */
const getTotalSupply = async () => {
  try {
    const totalSupply = await contract.methods.totalSupply().call();
    return web3.utils.fromWei(totalSupply, "ether");
  } catch (error) {
    logger.error(`Error fetching total supply: ${error.message}`);
    throw new Error("Total supply fetch failed");
  }
};

module.exports = {
  mintTokens,
  distributeMiningRewards,
  validateWallet,
  protectGovernanceTokens,
  getTotalSupply,
};
