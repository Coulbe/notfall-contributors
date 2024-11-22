/**
 * Task Management Tasks
 * This file contains pre-defined tasks for managing tasks within the Notfall Engineers On-Demand system.
 * These tasks focus on creating, assigning, tracking, and evaluating tasks across all user roles.
 */

const taskManagementTasks = [
  // ==================== TASK CREATION ====================
  {
    title: "Create Task API",
    description: "Develop an API to create new tasks, including fields for priority, skills required, and location.",
    role: "Backend Developer",
    folderAccess: [
      "backend/controllers/taskController.js",
      "backend/models/Task.js",
      "backend/validations/taskValidation.js",
    ],
    reward: 25,
    status: "Unassigned",
    priority: "High",
    tags: ["backend", "API", "tasks", "creation"],
  },
  {
    title: "Task Form UI",
    description: "Build a task creation form with fields for title, description, priority, and required skills.",
    role: "Frontend Developer",
    folderAccess: [
      "frontend/src/pages/TaskForm.jsx",
      "frontend/src/components/forms/TaskFormFields.jsx",
    ],
    reward: 20,
    status: "Unassigned",
    priority: "Medium",
    tags: ["frontend", "UI", "tasks", "creation"],
  },
  {
    title: "Bulk Task Import API",
    description: "Develop an API to upload multiple tasks via a CSV file, ensuring proper validation.",
    role: "Backend Developer",
    folderAccess: [
      "backend/controllers/taskController.js",
      "backend/utils/csvParser.js",
    ],
    reward: 30,
    status: "Unassigned",
    priority: "Medium",
    tags: ["backend", "API", "tasks", "bulk-import"],
  },

  // ==================== TASK ASSIGNMENT ====================
  {
    title: "Task Assignment API",
    description: "Create an API to assign tasks dynamically to contributors or engineers based on predefined criteria.",
    role: "Backend Developer",
    folderAccess: [
      "backend/services/taskMatchingService/engineerFinder.js",
      "backend/models/Task.js",
    ],
    reward: 35,
    status: "Unassigned",
    priority: "Critical",
    tags: ["backend", "API", "tasks", "assignment"],
  },
  {
    title: "Real-Time Task Notifications",
    description: "Implement WebSocket-based notifications to inform users of new task assignments.",
    role: "Backend Developer",
    folderAccess: [
      "backend/services/taskMatchingService/notificationHandler.js",
      "backend/models/Notification.js",
    ],
    reward: 25,
    status: "Unassigned",
    priority: "High",
    tags: ["backend", "notifications", "tasks"],
  },
  {
    title: "Task Assignment UI",
    description: "Build a UI for admins to assign tasks manually to contributors or engineers.",
    role: "Frontend Developer",
    folderAccess: [
      "frontend/src/pages/TaskAssignmentPage.jsx",
      "frontend/src/components/forms/TaskAssignmentForm.jsx",
    ],
    reward: 25,
    status: "Unassigned",
    priority: "High",
    tags: ["frontend", "UI", "tasks", "assignment"],
  },

  // ==================== TASK TRACKING ====================
  {
    title: "Task Status API",
    description: "Develop an API to update and fetch task statuses (e.g., Open, In Progress, Completed).",
    role: "Backend Developer",
    folderAccess: [
      "backend/controllers/taskController.js",
      "backend/models/Task.js",
    ],
    reward: 20,
    status: "Unassigned",
    priority: "High",
    tags: ["backend", "API", "tasks", "status"],
  },
  {
    title: "Task Tracking Dashboard",
    description: "Create a dashboard for users to view task statuses, deadlines, and progress.",
    role: "Frontend Developer",
    folderAccess: [
      "frontend/src/pages/TaskTrackingDashboard.jsx",
      "frontend/src/components/tasks/TaskList.jsx",
    ],
    reward: 30,
    status: "Unassigned",
    priority: "High",
    tags: ["frontend", "UI", "tasks", "tracking"],
  },
  {
    title: "Task Timeline Visualization",
    description: "Develop a timeline view to show task milestones, deadlines, and progress.",
    role: "Frontend Developer",
    folderAccess: [
      "frontend/src/components/tasks/TaskTimeline.jsx",
    ],
    reward: 25,
    status: "Unassigned",
    priority: "Medium",
    tags: ["frontend", "UI", "tasks", "tracking"],
  },

  // ==================== TASK FEEDBACK ====================
  {
    title: "Task Feedback API",
    description: "Develop an API for contributors or engineers to submit feedback on completed tasks.",
    role: "Backend Developer",
    folderAccess: [
      "backend/controllers/taskController.js",
      "backend/models/Feedback.js",
    ],
    reward: 20,
    status: "Unassigned",
    priority: "Medium",
    tags: ["backend", "API", "tasks", "feedback"],
  },
  {
    title: "Feedback Collection UI",
    description: "Build a form for contributors or engineers to provide feedback on completed tasks.",
    role: "Frontend Developer",
    folderAccess: [
      "frontend/src/components/forms/TaskFeedbackForm.jsx",
      "frontend/src/pages/TaskDetails.jsx",
    ],
    reward: 20,
    status: "Unassigned",
    priority: "Medium",
    tags: ["frontend", "UI", "tasks", "feedback"],
  },

  // ==================== TASK ANALYTICS ====================
  {
    title: "Task Analytics API",
    description: "Create an API to generate analytics on task performance, such as completion rates and delays.",
    role: "Backend Developer",
    folderAccess: [
      "backend/controllers/analyticsController.js",
      "backend/models/Task.js",
    ],
    reward: 30,
    status: "Unassigned",
    priority: "High",
    tags: ["backend", "API", "analytics", "tasks"],
  },
  {
    title: "Task Analytics Dashboard",
    description: "Develop a dashboard to display task analytics using charts and graphs.",
    role: "Frontend Developer",
    folderAccess: [
      "frontend/src/pages/TaskAnalyticsDashboard.jsx",
      "frontend/src/components/analytics/TaskAnalyticsChart.jsx",
    ],
    reward: 30,
    status: "Unassigned",
    priority: "High",
    tags: ["frontend", "UI", "analytics", "tasks"],
  },
];

module.exports = taskManagementTasks;
