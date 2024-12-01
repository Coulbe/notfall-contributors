const { ethers } = require("ethers");
require("dotenv").config();

// Load contract ABI and address
const contractABI = require("../contracts/Notcoin.json").abi;
const contractAddress = process.env.NOTCOIN_CONTRACT_ADDRESS;

// Create a provider and wallet signer
const provider = new ethers.providers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const notcoinContract = new ethers.Contract(contractAddress, contractABI, wallet);

/**
 * Mint Notcoin tokens to a contributor's address.
 */
async function mintTokens(to, amount) {
    try {
        const tx = await notcoinContract.mint(to, ethers.utils.parseEther(amount.toString()));
        await tx.wait();
        console.log(`Minted ${amount} NTC to ${to}`);
        return { success: true, txHash: tx.hash };
    } catch (error) {
        console.error("Error minting tokens:", error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Burn Notcoin tokens from the sender's address.
 */
async function burnTokens(amount) {
    try {
        const tx = await notcoinContract.burn(ethers.utils.parseEther(amount.toString()));
        await tx.wait();
        console.log(`Burned ${amount} NTC`);
        return { success: true, txHash: tx.hash };
    } catch (error) {
        console.error("Error burning tokens:", error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Transfer Notcoin tokens to another address.
 */
async function transferTokens(to, amount) {
    try {
        const tx = await notcoinContract.transfer(to, ethers.utils.parseEther(amount.toString()));
        await tx.wait();
        console.log(`Transferred ${amount} NTC to ${to}`);
        return { success: true, txHash: tx.hash };
    } catch (error) {
        console.error("Error transferring tokens:", error.message);
        return { success: false, error: error.message };
    }
}

module.exports = { mintTokens, burnTokens, transferTokens };
