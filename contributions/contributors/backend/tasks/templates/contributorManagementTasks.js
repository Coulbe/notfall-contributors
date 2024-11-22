/**
 * Contributor Management Tasks
 * This file contains pre-defined tasks for managing contributors within the Notfall Engineers On-Demand system.
 * These tasks are designed to ensure smooth onboarding, task management, and performance evaluation for contributors.
 */

const contributorManagementTasks = [
  // ==================== Profile Management ====================
  {
    title: "Create Contributor Profile API",
    description: "Develop an API to create contributor profiles with default roles and settings.",
    role: "Backend Developer",
    folderAccess: [
      "backend/controllers/contributorController.js",
      "backend/models/Contributor.js",
      "backend/validations/contributorValidation.js",
    ],
    reward: 20,
    priority: "High",
    tags: ["API", "backend", "profile"],
  },
  {
    title: "Update Contributor Profile API",
    description: "Allow contributors to update their profiles, including email, username, and bio.",
    role: "Backend Developer",
    folderAccess: [
      "backend/controllers/contributorController.js",
      "backend/models/Contributor.js",
      "backend/validations/contributorValidation.js",
    ],
    reward: 15,
    priority: "Medium",
    tags: ["API", "backend", "profile"],
  },
  {
    title: "Build Profile Page",
    description: "Design a profile page where contributors can view and edit their details.",
    role: "Frontend Developer",
    folderAccess: [
      "frontend/src/pages/Profile.jsx",
      "frontend/src/components/forms/EditProfileForm.jsx",
    ],
    reward: 15,
    priority: "Medium",
    tags: ["frontend", "profile", "UI"],
  },

  // ==================== Task Assignment and Tracking ====================
  {
    title: "Contributor Task Assignment API",
    description: "Create an API to automatically assign tasks to contributors based on their roles and expertise.",
    role: "Backend Developer",
    folderAccess: [
      "backend/controllers/contributorController.js",
      "backend/services/taskMatchingService/taskPriority.js",
      "backend/models/Task.js",
    ],
    reward: 25,
    priority: "Critical",
    tags: ["API", "backend", "tasks"],
  },
  {
    title: "Contributor Task Dashboard",
    description: "Build a dashboard for contributors to view their assigned tasks, task status, and rewards.",
    role: "Frontend Developer",
    folderAccess: [
      "frontend/src/components/dashboard/ContributorDashboard.jsx",
      "frontend/src/components/tasks/TaskList.jsx",
    ],
    reward: 25,
    priority: "High",
    tags: ["frontend", "dashboard", "tasks"],
  },
  {
    title: "Task Completion Tracking",
    description: "Add functionality to track the completion status of tasks and update contributor progress.",
    role: "Backend Developer",
    folderAccess: [
      "backend/controllers/taskController.js",
      "backend/models/Contributor.js",
      "backend/models/Task.js",
    ],
    reward: 20,
    priority: "High",
    tags: ["backend", "tasks", "tracking"],
  },

  // ==================== Rewards and Performance ====================
  {
    title: "Performance Metrics API",
    description: "Develop an API to calculate contributor performance metrics, such as task success rate and average completion time.",
    role: "Backend Developer",
    folderAccess: [
      "backend/controllers/contributorController.js",
      "backend/models/Contributor.js",
      "backend/models/Contribution.js",
    ],
    reward: 30,
    priority: "High",
    tags: ["backend", "metrics", "API"],
  },
  {
    title: "Rewards Dashboard",
    description: "Build a dashboard section to display earned rewards, upcoming payouts, and performance badges.",
    role: "Frontend Developer",
    folderAccess: [
      "frontend/src/components/dashboard/RewardStats.jsx",
      "frontend/src/components/badges/BadgeOverview.jsx",
    ],
    reward: 20,
    priority: "Medium",
    tags: ["frontend", "rewards", "UI"],
  },
  {
    title: "Reward Issuance API",
    description: "Develop backend logic to issue rewards (e.g., Notcoins) to contributors upon task completion.",
    role: "Backend Developer",
    folderAccess: [
      "backend/controllers/rewardController.js",
      "backend/services/rewardDistributionService/rewardIssuer.js",
    ],
    reward: 25,
    priority: "High",
    tags: ["backend", "rewards", "API"],
  },

  // ==================== Analytics and Insights ====================
  {
    title: "Contributor Analytics API",
    description: "Create an API to provide analytics on contributor performance, such as top contributors and total tasks completed.",
    role: "Backend Developer",
    folderAccess: [
      "backend/controllers/analyticsController.js",
      "backend/models/ContributorMetrics.js",
      "backend/models/Contribution.js",
    ],
    reward: 30,
    priority: "High",
    tags: ["backend", "analytics", "metrics"],
  },
  {
    title: "Contributor Insights Dashboard",
    description: "Build a dashboard to visualise contributor performance metrics using charts.",
    role: "Frontend Developer",
    folderAccess: [
      "frontend/src/components/analytics/TokenDistributionChart.jsx",
      "frontend/src/components/analytics/ContributionTrendsChart.jsx",
    ],
    reward: 25,
    priority: "Medium",
    tags: ["frontend", "analytics", "UI"],
  },

  // ==================== Notifications ====================
  {
    title: "Notification System API",
    description: "Build an API to send real-time notifications to contributors about new tasks, rewards, and updates.",
    role: "Backend Developer",
    folderAccess: [
      "backend/services/core/notificationService.js",
      "backend/models/Notification.js",
    ],
    reward: 20,
    priority: "Medium",
    tags: ["backend", "notifications", "API"],
  },
  {
    title: "Notification Panel",
    description: "Develop a notification panel UI to display real-time updates for contributors.",
    role: "Frontend Developer",
    folderAccess: [
      "frontend/src/components/notifications/NotificationPanel.jsx",
    ],
    reward: 15,
    priority: "Medium",
    tags: ["frontend", "notifications", "UI"],
  },
];

module.exports = contributorManagementTasks;
