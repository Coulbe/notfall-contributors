/**
 * templates/rewardTasks.js
 * Predefined tasks for implementing and managing the Notcoin reward system.
 */

const rewardTasks = [
  {
    title: "Reward Distribution API",
    description: "Create an API to issue Notcoin rewards for completed tasks.",
    role: "Backend Developer",
    folderAccess: [
      "backend/controllers/rewardController.js",
      "backend/services/rewardDistributionService/rewardIssuer.js",
    ],
    reward: 30,
    priority: "High",
    tags: ["backend", "rewards", "API"],
    status: "Unassigned",
  },
  {
    title: "Reward Dashboard",
    description: "Develop a dashboard to display rewards earned by contributors and engineers.",
    role: "Frontend Developer",
    folderAccess: ["frontend/src/pages/RewardDashboard.jsx"],
    reward: 25,
    priority: "Medium",
    tags: ["frontend", "UI", "dashboard"],
    status: "Unassigned",
  },
];

module.exports = rewardTasks;
