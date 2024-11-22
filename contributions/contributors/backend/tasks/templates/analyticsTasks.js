/**
 * templates/analyticsTasks.js
 * Predefined tasks for implementing system analytics and reporting features.
 */

const analyticsTasks = [
  {
    title: "System Metrics API",
    description: "Create an API to track system performance metrics and usage data.",
    role: "Backend Developer",
    folderAccess: [
      "backend/controllers/analyticsController.js",
      "backend/models/AuditLog.js",
    ],
    reward: 25,
    priority: "High",
    tags: ["backend", "analytics", "API"],
    status: "Unassigned",
  },
  {
    title: "Analytics Dashboard",
    description: "Develop a dashboard to display system performance metrics in real time.",
    role: "Frontend Developer",
    folderAccess: ["frontend/src/pages/AdminAnalytics.jsx"],
    reward: 30,
    priority: "High",
    tags: ["frontend", "UI", "analytics"],
    status: "Unassigned",
  },
];

module.exports = analyticsTasks;
