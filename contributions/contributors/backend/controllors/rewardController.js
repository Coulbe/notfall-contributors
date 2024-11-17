const { mintTokens, burnTokens, transferTokens } = require("../services/notcoinService");
const Contributor = require("../models/Contributor");

exports.addRewardPoints = async (req, res, next) => {
  const { contributorId } = req.params;
  const { points, tokens } = req.body;

  try {
    const contributor = await Contributor.findById(contributorId);

    if (!contributor) {
      return res.status(404).json({ message: "Contributor not found" });
    }

    contributor.rewardPoints += points;
    contributor.wallet.balance += tokens;

    await contributor.save();

    // Mint tokens via the smart contract
    const mintResult = await mintTokens(contributor.wallet.address, tokens);

    if (!mintResult.success) {
      throw new Error(`Failed to mint tokens: ${mintResult.error}`);
    }

    res.status(200).json({
      message: "Reward points and tokens added successfully",
      txHash: mintResult.txHash,
    });
  } catch (error) {
    next(error);
  }
};

exports.transferTokens = async (req, res, next) => {
  const { recipientId, tokens } = req.body;

  try {
    const sender = await Contributor.findById(req.user.id);
    const recipient = await Contributor.findById(recipientId);

    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    if (sender.wallet.balance < tokens) {
      return res.status(400).json({ message: "Insufficient tokens for transfer" });
    }

    sender.wallet.balance -= tokens;
    recipient.wallet.balance += tokens;

    await sender.save();
    await recipient.save();

    // Transfer tokens via the smart contract
    const transferResult = await transferTokens(recipient.wallet.address, tokens);

    if (!transferResult.success) {
      throw new Error(`Failed to transfer tokens: ${transferResult.error}`);
    }

    res.status(200).json({
      message: `Successfully transferred ${tokens} NTC to ${recipient.username}`,
      txHash: transferResult.txHash,
    });
  } catch (error) {
    next(error);
  }

  exports.rewardContributor = async (req, res) => {
  const { contributorId, contributionId } = req.params;

  try {
    const contributor = await Contributor.findById(contributorId);
    const contribution = await Contribution.findById(contributionId);

    if (!contributor) {
      return res.status(404).json({ message: "Contributor not found" });
    }

    if (!contribution) {
      return res.status(404).json({ message: "Contribution not found" });
    }

    // Calculate tokens based on category, subcategory, and score
    const tokens = calculateRewardTokens(contribution);

    if (tokens <= 0) {
      return res.status(400).json({ message: "No tokens earned for this contribution" });
    }

    contributor.wallet.balance += tokens;
    await contributor.save();

    const mintResult = await mintTokens(contributor.wallet.address, tokens);

    if (!mintResult.success) {
      throw new Error(`Failed to mint tokens: ${mintResult.error}`);
    }

    res.status(200).json({
      message: "Contributor rewarded successfully",
      tokensAwarded: tokens,
      txHash: mintResult.txHash,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to reward contributor", error: error.message });
  }
};

};
