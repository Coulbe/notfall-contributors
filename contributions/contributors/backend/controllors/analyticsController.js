const Contributor = require("../models/Contributor");
const Contribution = require("../models/Contribution");

/**
 * Get overall token distribution trends.
 */
exports.getTokenDistribution = async (req, res) => {
  try {
    const contributors = await Contributor.find();

    const totalTokensDistributed = contributors.reduce((sum, contributor) => sum + contributor.wallet.balance, 0);

    const tokenBreakdown = contributors.map((contributor) => ({
      username: contributor.username,
      tokens: contributor.wallet.balance,
    }));

    res.status(200).json({
      totalTokensDistributed,
      tokenBreakdown,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch token distribution data", error: error.message });
  }
};

/**
 * Get contribution trends over time.
 */
exports.getContributionTrends = async (req, res) => {
  try {
    const contributions = await Contribution.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          totalContributions: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      contributionTrends: contributions,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch contribution trends", error: error.message });
  }
};

/**
 * Get leaderboard data.
 */
exports.getLeaderboard = async (req, res) => {
  try {
    const contributors = await Contributor.find()
      .populate("contributions")
      .sort({ "wallet.balance": -1 })
      .limit(10);

    const leaderboard = contributors.map((contributor) => ({
      username: contributor.username,
      totalTokens: contributor.wallet.balance,
      totalContributions: contributor.contributions.length,
    }));

    res.status(200).json({
      leaderboard,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch leaderboard data", error: error.message });
  }
};

/**
 * Get detailed contribution metrics for a contributor.
 */
exports.getContributorMetrics = async (req, res) => {
  const { contributorId } = req.params;

  try {
    const contributor = await Contributor.findById(contributorId).populate("contributions");

    if (!contributor) {
      return res.status(404).json({ message: "Contributor not found" });
    }

    const contributionBreakdown = contributor.contributions.reduce((acc, contribution) => {
      acc[contribution.category] = (acc[contribution.category] || 0) + 1;
      return acc;
    }, {});

    res.status(200).json({
      username: contributor.username,
      totalTokens: contributor.wallet.balance,
      totalContributions: contributor.contributions.length,
      contributionBreakdown,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch contributor metrics", error: error.message });
  }
};

/**
 * Get category-specific metrics for contributions.
 */
exports.getCategoryMetrics = async (req, res) => {
  try {
    const categoryMetrics = await Contribution.aggregate([
      {
        $group: {
          _id: "$category",
          totalContributions: { $sum: 1 },
        },
      },
      { $sort: { totalContributions: -1 } },
    ]);

    res.status(200).json({
      categoryMetrics,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch category metrics", error: error.message });
  }
};
