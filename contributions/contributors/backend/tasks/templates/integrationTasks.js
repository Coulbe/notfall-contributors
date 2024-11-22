/**
 * integrationTasks.js
 * Predefined tasks for backend, frontend, and blockchain integration.
 * These tasks ensure that different layers of the application work seamlessly together.
 */

module.exports = [
  // Backend and Frontend Integration Tasks
  {
    title: "Sync Task Management APIs with Frontend",
    description: "Integrate task management APIs with the frontend dashboard to fetch, assign, and update tasks in real-time.",
    role: "Full-Stack Developer",
    folderAccess: [
      "backend/controllers/taskController.js",
      "frontend/src/components/tasks/TaskList.jsx",
      "frontend/src/components/tasks/TaskDetails.jsx",
    ],
    reward: 25,
    priority: "High",
    tags: ["integration", "full-stack", "tasks"],
    status: "Unassigned",
  },
  {
    title: "Real-Time Notifications",
    description: "Implement WebSocket-based real-time notifications for task assignments and updates.",
    role: "Backend Developer",
    folderAccess: [
      "backend/services/notificationService.js",
      "frontend/src/components/notifications/NotificationPanel.jsx",
    ],
    reward: 30,
    priority: "High",
    tags: ["integration", "notifications", "real-time"],
    status: "Unassigned",
  },

  // Backend and Blockchain Integration Tasks
  {
    title: "Integrate Notcoin with Rewards System",
    description: "Connect the Notcoin smart contract with the reward system to automatically mint and distribute tokens upon task completion.",
    role: "Blockchain Developer",
    folderAccess: [
      "backend/services/blockchain/notcoinService.js",
      "backend/controllers/rewardController.js",
    ],
    reward: 40,
    priority: "High",
    tags: ["blockchain", "integration", "rewards"],
    status: "Unassigned",
  },
  {
    title: "Token Vesting Integration",
    description: "Implement token vesting schedules for long-term contributors and engineers using the Vesting smart contract.",
    role: "Blockchain Developer",
    folderAccess: [
      "backend/services/blockchain/vestingService.js",
      "backend/controllers/rewardController.js",
    ],
    reward: 35,
    priority: "Medium",
    tags: ["blockchain", "vesting", "rewards"],
    status: "Unassigned",
  },

  // Frontend and Blockchain Integration Tasks
  {
    title: "Display Wallet Balance in Dashboard",
    description: "Integrate blockchain wallet APIs to fetch and display the current Notcoin balance in the contributor and engineer dashboards.",
    role: "Frontend Developer",
    folderAccess: [
      "frontend/src/components/dashboard/RewardStats.jsx",
      "frontend/src/services/api.js",
    ],
    reward: 20,
    priority: "Medium",
    tags: ["frontend", "blockchain", "dashboard"],
    status: "Unassigned",
  },
  {
    title: "Transaction History View",
    description: "Build a UI component to display blockchain transaction history for each contributor and engineer.",
    role: "Frontend Developer",
    folderAccess: [
      "frontend/src/components/dashboard/TransactionHistory.jsx",
      "frontend/src/services/api.js",
    ],
    reward: 25,
    priority: "Low",
    tags: ["frontend", "blockchain", "UI"],
    status: "Unassigned",
  },

  // General Integration Tasks
  {
    title: "Cross-Origin Resource Sharing (CORS) Setup",
    description: "Ensure secure cross-origin resource sharing (CORS) between the backend APIs and the frontend.",
    role: "Backend Developer",
    folderAccess: ["backend/app.js", "backend/config/serverConfig.js"],
    reward: 15,
    priority: "High",
    tags: ["backend", "security", "CORS"],
    status: "Unassigned",
  },
  {
    title: "Environment-Specific Configuration",
    description: "Configure environment-specific settings (development, staging, production) for seamless deployment.",
    role: "DevOps Engineer",
    folderAccess: ["backend/config/dotenv.js", "frontend/public/env-config.js"],
    reward: 20,
    priority: "Medium",
    tags: ["configuration", "DevOps", "environment"],
    status: "Unassigned",
  },
  {
    title: "API Versioning",
    description: "Implement API versioning to ensure backward compatibility during updates.",
    role: "Backend Developer",
    folderAccess: ["backend/routes/taskRoutes.js", "backend/routes/contributorRoutes.js"],
    reward: 20,
    priority: "Medium",
    tags: ["backend", "API", "versioning"],
    status: "Unassigned",
  },
];
