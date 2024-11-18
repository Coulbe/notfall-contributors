import api from "./api";

/**
 * Fetch token distribution data.
 * Example: Percentage of tokens held by Admins, Contributors, Investors, etc.
 */
export const fetchTokenDistribution = async () => {
  const response = await api.get("/analytics/token-distribution");
  return response.data; // Returns [{ name: "Admins", value: 5000 }, ...]
};

/**
 * Fetch contribution trends over time.
 * Example: Number of contributions and reviews each month.
 */
export const fetchContributionTrends = async () => {
  const response = await api.get("/analytics/contribution-trends");
  return response.data; // Returns [{ month: "January", contributions: 50, reviews: 20 }, ...]
};

/**
 * Fetch contributor leaderboard.
 * Example: Top contributors ranked by contributions and engagement.
 */
export const fetchLeaderboard = async (limit = 10) => {
  const response = await api.get(`/analytics/leaderboard?limit=${limit}`);
  return response.data; // Returns [{ name: "John Doe", score: 1500 }, ...]
};

/**
 * Fetch activity heatmap data.
 * Example: Contributions and tasks completed per day for heatmap visualization.
 */
export const fetchActivityHeatmap = async () => {
  const response = await api.get("/analytics/activity-heatmap");
  return response.data; // Returns [{ date: "2024-11-01", contributions: 5 }, ...]
};

/**
 * Fetch reward distribution metrics.
 * Example: Distribution of rewards (tokens, badges) over contributors.
 */
export const fetchRewardMetrics = async () => {
  const response = await api.get("/analytics/reward-metrics");
  return response.data; // Returns reward metrics data
};

/**
 * Fetch detailed analytics for a specific contributor.
 * Example: Contributor's contributions, reviews, rewards, and engagement metrics.
 */
export const fetchContributorAnalytics = async (contributorId) => {
  const response = await api.get(`/analytics/contributor/${contributorId}`);
  return response.data; // Returns analytics for the specific contributor
};

/**
 * Fetch task efficiency metrics.
 * Example: Average time taken to complete tasks by contributors or teams.
 */
export const fetchTaskEfficiencyMetrics = async () => {
  const response = await api.get("/analytics/task-efficiency");
  return response.data; // Returns [{ contributor: "Jane", avgCompletionTime: 2.5 }, ...]
};

/**
 * Fetch badge achievement distribution.
 * Example: How many contributors earned specific badges.
 */
export const fetchBadgeAchievements = async () => {
  const response = await api.get("/analytics/badge-achievements");
  return response.data; // Returns badge distribution data
};

/**
 * Fetch token flow metrics.
 * Example: Token inflow/outflow per contributor over time.
 */
export const fetchTokenFlowMetrics = async () => {
  const response = await api.get("/analytics/token-flow");
  return response.data; // Returns token inflow/outflow data
};

/**
 * Fetch user engagement metrics.
 * Example: Time spent on the platform, active days, etc.
 */
export const fetchEngagementMetrics = async () => {
  const response = await api.get("/analytics/engagement");
  return response.data; // Returns engagement metrics data
};

/**
 * Fetch project-wide health metrics.
 * Example: Overall activity levels, task completion rates, and user retention.
 */
export const fetchProjectHealthMetrics = async () => {
  const response = await api.get("/analytics/project-health");
  return response.data; // Returns project health analytics
};
