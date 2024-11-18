import api from "./api";

/**
 * Fetch token distribution metrics.
 * Example: Distribution of tokens among Admins, Contributors, Investors, etc.
 * @returns {Array} - [{ name: "Admins", value: 5000 }, ...]
 */
export const fetchTokenDistribution = async () => {
  const response = await api.get("/analytics/token-distribution");
  return response.data;
};

/**
 * Fetch contribution trends over time.
 * Example: Contributions and reviews per month for the last year.
 * @returns {Array} - [{ month: "January", contributions: 50, reviews: 20 }, ...]
 */
export const fetchContributionTrends = async () => {
  const response = await api.get("/analytics/contribution-trends");
  return response.data;
};

/**
 * Fetch leaderboard for top contributors.
 * Example: Top contributors ranked by their contribution scores.
 * @param {Number} limit - Number of top contributors to fetch (default: 10).
 * @returns {Array} - [{ name: "John Doe", score: 1500 }, ...]
 */
export const fetchLeaderboard = async (limit = 10) => {
  const response = await api.get(`/analytics/leaderboard?limit=${limit}`);
  return response.data;
};

/**
 * Fetch activity heatmap data.
 * Example: Contributions or tasks completed per day for a heatmap visualization.
 * @param {Object} params - Additional filters like date range or contributor ID.
 * @returns {Array} - [{ date: "2024-11-01", contributions: 5 }, ...]
 */
export const fetchActivityHeatmap = async (params = {}) => {
  const response = await api.get("/analytics/activity-heatmap", { params });
  return response.data;
};

/**
 * Fetch reward distribution metrics.
 * Example: Rewards (tokens, badges) distribution across contributors.
 * @returns {Object} - { totalTokens: 50000, totalBadges: 100, contributors: [...] }
 */
export const fetchRewardMetrics = async () => {
  const response = await api.get("/analytics/reward-metrics");
  return response.data;
};

/**
 * Fetch detailed analytics for a specific contributor.
 * Example: Contributor's contributions, reviews, rewards, and engagement metrics.
 * @param {String} contributorId - ID of the contributor to fetch analytics for.
 * @returns {Object} - Detailed analytics for the contributor.
 */
export const fetchContributorAnalytics = async (contributorId) => {
  const response = await api.get(`/analytics/contributor/${contributorId}`);
  return response.data;
};

/**
 * Fetch task efficiency metrics.
 * Example: Average task completion time and task resolution rates.
 * @returns {Array} - [{ contributor: "Jane Doe", avgCompletionTime: 2.5 }, ...]
 */
export const fetchTaskEfficiencyMetrics = async () => {
  const response = await api.get("/analytics/task-efficiency");
  return response.data;
};

/**
 * Fetch badge achievement distribution.
 * Example: Number of contributors who earned specific badges.
 * @returns {Array} - [{ badge: "Expert Contributor", count: 10 }, ...]
 */
export const fetchBadgeAchievements = async () => {
  const response = await api.get("/analytics/badge-achievements");
  return response.data;
};

/**
 * Fetch token flow metrics.
 * Example: Token inflow/outflow trends for contributors over time.
 * @param {Object} params - Additional filters like date range or contributor ID.
 * @returns {Array} - [{ date: "2024-11-01", inflow: 500, outflow: 200 }, ...]
 */
export const fetchTokenFlowMetrics = async (params = {}) => {
  const response = await api.get("/analytics/token-flow", { params });
  return response.data;
};

/**
 * Fetch user engagement metrics.
 * Example: Time spent on the platform, active days, and interaction rates.
 * @returns {Object} - { activeUsers: 150, avgSessionTime: "25 minutes", ... }
 */
export const fetchEngagementMetrics = async () => {
  const response = await api.get("/analytics/engagement");
  return response.data;
};

/**
 * Fetch project-wide health metrics.
 * Example: Overall activity levels, task completion rates, and user retention.
 * @returns {Object} - Metrics representing the platform's health.
 */
export const fetchProjectHealthMetrics = async () => {
  const response = await api.get("/analytics/project-health");
  return response.data;
};

/**
 * Fetch historical token price trends (if applicable for tokenomics).
 * Example: Price trends for NotCoin over time.
 * @returns {Array} - [{ date: "2024-11-01", price: 0.25 }, ...]
 */
export const fetchTokenPriceTrends = async () => {
  const response = await api.get("/analytics/token-price-trends");
  return response.data;
};
