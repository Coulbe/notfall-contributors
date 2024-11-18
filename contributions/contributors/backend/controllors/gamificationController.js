const Contributor = require("../models/Contributor");
const Contribution = require("../models/Contribution");

/**
 * Assign badges to contributors based on their contributions.
 * Multi-level badges and category-specific badges are supported.
 */
exports.assignBadges = async (contributor) => {
  const badges = contributor.badges || [];
  const contributionCounts = contributor.contributions.reduce((acc, contribution) => {
    acc[contribution.category] = (acc[contribution.category] || 0) + 1;
    return acc;
  }, {});

  // Define badge criteria
  const badgeCriteria = [
    { category: "bug-fixes", level: "I", threshold: 10, badge: "Bug Hunter I" },
    { category: "bug-fixes", level: "II", threshold: 50, badge: "Bug Hunter II" },
    { category: "feature-development", level: "I", threshold: 5, badge: "Feature Innovator I" },
    { category: "feature-development", level: "II", threshold: 20, badge: "Feature Innovator II" },
    { category: "documentation", level: "I", threshold: 10, badge: "Documentation Guru" },
  ];

  // Assign badges
  badgeCriteria.forEach((criteria) => {
    if (
      contributionCounts[criteria.category] >= criteria.threshold &&
      !badges.includes(criteria.badge)
    ) {
      badges.push(criteria.badge);
    }
  });

  contributor.badges = badges;
  await contributor.save();
  return badges;
};

/**
 * Calculate and reward streak bonuses.
 */
exports.calculateStreakBonus = async (contributor) => {
  const now = new Date();
  const lastContributionDate = new Date(contributor.lastContributionDate);
  const daysSinceLastContribution = Math.floor((now - lastContributionDate) / (1000 * 60 * 60 * 24));

  // Increment or reset streak based on activity
  if (daysSinceLastContribution === 1) {
    contributor.streakCount += 1;
  } else if (daysSinceLastContribution > 1) {
    contributor.streakCount = 0;
  }

  // Reward tokens based on streak count
  const bonusTokens = contributor.streakCount * 10; // Example: 10 tokens per streak day
  contributor.wallet.balance += bonusTokens;
  contributor.lastContributionDate = now;

  await contributor.save();
  return { bonusTokens, streakCount: contributor.streakCount };
};

/**
 * Check and reward milestone achievements.
 */
exports.checkMilestones = async (contributor) => {
  const milestones = [
    { count: 10, reward: 50 }, // 50 tokens for 10 contributions
    { count: 50, reward: 200 }, // 200 tokens for 50 contributions
    { count: 100, reward: 500 }, // 500 tokens for 100 contributions
  ];

  let milestoneReward = 0;

  milestones.forEach((milestone) => {
    if (contributor.contributions.length === milestone.count) {
      milestoneReward += milestone.reward;
    }
  });

  if (milestoneReward > 0) {
    contributor.wallet.balance += milestoneReward;
    await contributor.save();
  }

  return milestoneReward;
};

/**
 * Fetch badges for a specific contributor.
 */
exports.getBadges = async (req, res) => {
  const { contributorId } = req.params;

  try {
    const contributor = await Contributor.findById(contributorId);
    if (!contributor) return res.status(404).json({ message: "Contributor not found" });

    res.status(200).json({ badges: contributor.badges });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch badges", error: error.message });
  }
};

/**
 * Fetch streak and milestone details for a specific contributor.
 */
exports.getGamificationDetails = async (req, res) => {
  const { contributorId } = req.params;

  try {
    const contributor = await Contributor.findById(contributorId);
    if (!contributor) return res.status(404).json({ message: "Contributor not found" });

    const streak = contributor.streakCount;
    const totalContributions = contributor.contributions.length;

    res.status(200).json({
      streak,
      totalContributions,
      badges: contributor.badges,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch gamification details", error: error.message });
  }
};
