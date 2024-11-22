/**
 * Engineer Management Tasks
 * This file contains pre-defined tasks for managing engineers within the Notfall Engineers On-Demand system.
 * These tasks ensure seamless integration of engineers into the workflow, focusing on task assignments, performance tracking, and notifications.
 */

const engineerManagementTasks = [
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
];

module.exports = engineerManagementTasks;
