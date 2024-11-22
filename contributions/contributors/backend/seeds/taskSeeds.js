/**
 * Seeds file for initializing tasks in the database.
 * Covers backend, frontend, blockchain, analytics, and DevOps tasks for contributors.
 */

const taskSeeds = [
  // ==================== AUTHENTICATION TASKS ====================
{
  title: "Develop Login API",
  description: "Create a secure API endpoint for user login with JWT token generation.",
  role: "Backend Developer",
  folderAccess: [
    "backend/controllers/authController.js",
    "backend/middleware/authMiddleware.js",
  ],
  reward: 15,
  status: "Unassigned",
  priority: "High",
  tags: ["authentication", "backend", "JWT"],
},
{
  title: "Design Signup Page",
  description: "Build a responsive signup page with form validation and error handling.",
  role: "Frontend Developer",
  folderAccess: ["frontend/src/pages/Signup.jsx"],
  reward: 10,
  status: "Unassigned",
  priority: "Medium",
  tags: ["authentication", "frontend", "UI"],
},
{
  title: "Develop Token Refresh API",
  description: "Create an endpoint to allow users to refresh their authentication token before it expires.",
  role: "Backend Developer",
  folderAccess: [
    "backend/controllers/authController.js",
    "backend/middleware/authMiddleware.js",
  ],
  reward: 20,
  status: "Unassigned",
  priority: "High",
  tags: ["authentication", "backend", "security"],
},
{
  title: "Implement Password Reset API",
  description: "Develop an API to allow users to reset their password via email verification.",
  role: "Backend Developer",
  folderAccess: [
    "backend/controllers/authController.js",
    "backend/services/emailService.js",
    "backend/validations/userValidation.js",
  ],
  reward: 25,
  status: "Unassigned",
  priority: "High",
  tags: ["authentication", "backend", "password-reset"],
},
{
  title: "Create Multi-Factor Authentication (MFA) API",
  description: "Implement MFA using email or SMS-based OTP for additional security during login.",
  role: "Backend Developer",
  folderAccess: [
    "backend/controllers/authController.js",
    "backend/services/mfaService.js",
    "backend/models/User.js",
  ],
  reward: 30,
  status: "Unassigned",
  priority: "Critical",
  tags: ["authentication", "MFA", "backend"],
},
{
  title: "Design Password Reset Page",
  description: "Build a responsive page for users to reset their password after verifying their email.",
  role: "Frontend Developer",
  folderAccess: ["frontend/src/pages/PasswordReset.jsx"],
  reward: 15,
  status: "Unassigned",
  priority: "Medium",
  tags: ["authentication", "frontend", "UI"],
},
{
  title: "Build User Role Management API",
  description: "Create an API to manage user roles (Admin, Contributor, Engineer) dynamically.",
  role: "Backend Developer",
  folderAccess: [
    "backend/controllers/usersController.js",
    "backend/models/User.js",
    "backend/middleware/roleMiddleware.js",
  ],
  reward: 25,
  status: "Unassigned",
  priority: "High",
  tags: ["authentication", "backend", "roles"],
},
{
  title: "Enable Social Authentication",
  description: "Integrate third-party login using Google or GitHub.",
  role: "Backend Developer",
  folderAccess: [
    "backend/controllers/authController.js",
    "backend/services/oauthService.js",
  ],
  reward: 40,
  status: "Unassigned",
  priority: "Medium",
  tags: ["authentication", "backend", "OAuth"],
},
{
  title: "Log Out API",
  description: "Create an API to securely log out users and invalidate their tokens.",
  role: "Backend Developer",
  folderAccess: [
    "backend/controllers/authController.js",
    "backend/models/TokenBlacklist.js",
  ],
  reward: 10,
  status: "Unassigned",
  priority: "Medium",
  tags: ["authentication", "backend", "logout"],
},

  // ==================== CONTRIBUTOR MANAGEMENT TASKS ====================
  /**
 * Contributor Management Tasks
 * This file contains pre-defined tasks for managing contributors within the Notfall Engineers On-Demand system.
 * These tasks are designed to ensure smooth onboarding, task management, and performance evaluation for contributors.
 */
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

  // ==================== ENGINEER MANAGEMENT TASKS ====================
  {
    title: "Engineer Metrics API",
    description: "Create an API to track engineer performance metrics, such as task success rate and average completion time.",
    role: "Backend Developer",
    folderAccess: [
      "backend/controllers/engineerController.js",
      "backend/models/Engineer.js",
    ],
    reward: 20,
    status: "Unassigned",
    priority: "High",
    tags: ["backend", "API", "engineer"],
  },
  {
    title: "Engineer Dashboard",
    description: "Develop an engineer dashboard to display metrics, assigned tasks, and notifications.",
    role: "Frontend Developer",
    folderAccess: ["frontend/src/components/dashboard/EngineerDashboard.jsx"],
    reward: 25,
    status: "Unassigned",
    priority: "High",
    tags: ["frontend", "dashboard", "engineer"],
  },
  {
    title: "Engineer Task Assignment API",
    description: "Build an API to dynamically assign tasks to engineers based on skills, location, and availability.",
    role: "Backend Developer",
    folderAccess: [
      "backend/controllers/engineerController.js",
      "backend/services/taskMatchingService/engineerFinder.js",
    ],
    reward: 30,
    status: "Unassigned",
    priority: "Critical",
    tags: ["backend", "API", "tasks", "engineer"],
  },
  {
    title: "Task Status Update API for Engineers",
    description: "Develop an API for engineers to update task statuses (e.g., 'In Progress', 'Completed').",
    role: "Backend Developer",
    folderAccess: [
      "backend/controllers/taskController.js",
      "backend/models/Task.js",
    ],
    reward: 20,
    status: "Unassigned",
    priority: "High",
    tags: ["backend", "API", "tasks", "engineer"],
  },
  {
    title: "Engineer Notifications API",
    description: "Create an API to send notifications to engineers about new tasks, updates, or reminders.",
    role: "Backend Developer",
    folderAccess: [
      "backend/services/core/notificationService.js",
      "backend/models/Notification.js",
    ],
    reward: 15,
    status: "Unassigned",
    priority: "Medium",
    tags: ["backend", "notifications", "API", "engineer"],
  },
  {
    title: "Engineer Notifications Panel",
    description: "Develop a notification panel in the engineer dashboard to display real-time task updates and reminders.",
    role: "Frontend Developer",
    folderAccess: ["frontend/src/components/notifications/EngineerNotificationsPanel.jsx"],
    reward: 20,
    status: "Unassigned",
    priority: "High",
    tags: ["frontend", "notifications", "engineer", "UI"],
  },
  {
    title: "Engineer Availability API",
    description: "Build an API for engineers to set their availability for task assignments.",
    role: "Backend Developer",
    folderAccess: [
      "backend/controllers/engineerController.js",
      "backend/models/Engineer.js",
    ],
    reward: 20,
    status: "Unassigned",
    priority: "Medium",
    tags: ["backend", "API", "engineer", "availability"],
  },
  {
    title: "Engineer Profile Management",
    description: "Create a profile page for engineers to view and edit their information, such as skills, location, and availability.",
    role: "Frontend Developer",
    folderAccess: [
      "frontend/src/pages/EngineerProfile.jsx",
      "frontend/src/components/forms/EngineerProfileForm.jsx",
    ],
    reward: 25,
    status: "Unassigned",
    priority: "High",
    tags: ["frontend", "profile", "UI", "engineer"],
  },
  {
    title: "Real-Time Task Notifications for Engineers",
    description: "Implement real-time WebSocket notifications for engineers when a new task is assigned or updated.",
    role: "Backend Developer",
    folderAccess: [
      "backend/services/taskMatchingService/notificationHandler.js",
      "backend/models/Notification.js",
    ],
    reward: 30,
    status: "Unassigned",
    priority: "High",
    tags: ["backend", "notifications", "real-time", "engineer"],
  },
  {
    title: "Engineer Performance Analytics",
    description: "Develop analytics to visualise engineer performance trends, such as tasks completed and success rates.",
    role: "Backend Developer",
    folderAccess: [
      "backend/controllers/analyticsController.js",
      "backend/models/EngineerMetrics.js",
    ],
    reward: 30,
    status: "Unassigned",
    priority: "High",
    tags: ["backend", "analytics", "engineer", "metrics"],
  },
  {
    title: "Engineer Performance Dashboard",
    description: "Build a dashboard section to display engineer performance metrics using charts.",
    role: "Frontend Developer",
    folderAccess: [
      "frontend/src/components/analytics/EngineerPerformanceChart.jsx",
      "frontend/src/pages/EngineerDashboard.jsx",
    ],
    reward: 25,
    status: "Unassigned",
    priority: "High",
    tags: ["frontend", "analytics", "UI", "engineer"],
  },
  {
    title: "Engineer Task Feedback API",
    description: "Develop an API to collect and store feedback from engineers about assigned tasks.",
    role: "Backend Developer",
    folderAccess: [
      "backend/controllers/taskController.js",
      "backend/models/Feedback.js",
    ],
    reward: 20,
    status: "Unassigned",
    priority: "Medium",
    tags: ["backend", "API", "feedback", "engineer"],
  },
  {
    title: "Engineer Task Feedback UI",
    description: "Build a UI for engineers to submit feedback on completed tasks.",
    role: "Frontend Developer",
    folderAccess: [
      "frontend/src/components/forms/TaskFeedbackForm.jsx",
      "frontend/src/pages/EngineerDashboard.jsx",
    ],
    reward: 20,
    status: "Unassigned",
    priority: "Medium",
    tags: ["frontend", "UI", "feedback", "engineer"],
  },

  // ==================== TASK MANAGEMENT TASKS ====================
  {
    title: "Task Creation and Assignment API",
    description: "Build an API to allow admins to create tasks and assign them to the best-matched engineers.",
    role: "Backend Developer",
    folderAccess: [
      "backend/controllers/taskController.js",
      "backend/services/taskMatchingService/engineerFinder.js",
      "backend/models/Task.js",
      "backend/models/Engineer.js",
    ],
    reward: 25,
    status: "Unassigned",
    priority: "Critical",
    tags: ["task", "backend", "matching"],
  },
  {
    title: "Task List Component",
    description: "Develop a React component to display tasks with filters and sorting.",
    role: "Frontend Developer",
    folderAccess: ["frontend/src/components/tasks/TaskList.jsx"],
    reward: 18,
    status: "Unassigned",
    priority: "Medium",
    tags: ["frontend", "UI", "tasks"],
  },

  // ==================== REWARD SYSTEM TASKS ====================
  {
    title: "Reward Calculation Logic",
    description: "Create backend logic to calculate Notcoin rewards for contributors.",
    role: "Backend Developer",
    folderAccess: [
      "backend/services/rewardDistributionService/rewardCalculator.js",
    ],
    reward: 25,
    status: "Unassigned",
    priority: "High",
    tags: ["rewards", "backend", "calculation"],
  },
  {
    title: "Rewards Dashboard Component",
    description: "Design a React component to display contributor rewards and earnings.",
    role: "Frontend Developer",
    folderAccess: ["frontend/src/components/dashboard/RewardStats.jsx"],
    reward: 18,
    status: "Unassigned",
    priority: "Medium",
    tags: ["rewards", "frontend", "dashboard"],
  },

  // ==================== BLOCKCHAIN INTEGRATION TASKS ====================
  {
    title: "Notcoin Minting Integration",
    description: "Integrate smart contracts to mint Notcoins for rewards.",
    role: "Blockchain Developer",
    folderAccess: ["backend/services/blockchain/notcoinService.js"],
    reward: 30,
    status: "Unassigned",
    priority: "High",
    tags: ["blockchain", "notcoin", "rewards"],
  },
  {
    title: "Vesting Schedule API",
    description: "Develop APIs to manage token vesting for long-term contributors.",
    role: "Blockchain Developer",
    folderAccess: ["backend/services/blockchain/vestingService.js"],
    reward: 25,
    status: "Unassigned",
    priority: "Medium",
    tags: ["blockchain", "vesting", "rewards"],
  },

  // ==================== DEVOPS TASKS ====================
  {
    title: "Setup CI/CD for Backend",
    description: "Implement CI/CD pipelines for automated backend deployments.",
    role: "DevOps Engineer",
    folderAccess: ["backend/config/serverConfig.js", "backend/tests"],
    reward: 30,
    status: "Unassigned",
    priority: "Critical",
    tags: ["devops", "CI/CD", "backend"],
  },
  {
    title: "Containerize Frontend with Docker",
    description: "Create Docker containers for the frontend application to standardize deployments.",
    role: "DevOps Engineer",
    folderAccess: ["frontend/Dockerfile", "frontend/src"],
    reward: 25,
    status: "Unassigned",
    priority: "High",
    tags: ["devops", "docker", "frontend"],
  },

  // ==================== BUG FIXING TASKS ====================
  {
    title: "Fix JWT Expiry Issue",
    description: "Resolve the issue causing expired JWT tokens to throw unhandled exceptions.",
    role: "Backend Developer",
    folderAccess: ["backend/middleware/authMiddleware.js"],
    reward: 15,
    status: "Unassigned",
    priority: "High",
    tags: ["bugfix", "authentication", "backend"],
  },
  {
    title: "Fix UI Responsiveness on Mobile",
    description: "Address layout issues on mobile devices for the Contributor Dashboard.",
    role: "Frontend Developer",
    folderAccess: ["frontend/src/components/dashboard/ContributorDashboard.jsx"],
    reward: 15,
    status: "Unassigned",
    priority: "Medium",
    tags: ["bugfix", "frontend", "UI"],
  },
];

module.exports = taskSeeds;
