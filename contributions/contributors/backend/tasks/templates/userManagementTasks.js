/**
 * templates/userManagementTasks.js
 * Comprehensive tasks for managing users such as homeowners, property managers, tenants, and businesses.
 * Includes APIs, dashboards, notifications, role management, and payment systems.
 */

const userManagementTasks = [
  {
    title: "User Profile API",
    description: "Develop an API to allow users to view and update their profiles, including fields like name, email, phone number, and preferred contact method.",
    role: "Backend Developer",
    folderAccess: [
      "backend/controllers/usersController.js",
      "backend/models/User.js",
    ],
    reward: 20,
    priority: "High",
    tags: ["backend", "API", "users"],
    status: "Unassigned",
  },
  {
    title: "User Registration Flow",
    description: "Design and implement a multi-step registration process, including user type selection (e.g., homeowner, tenant), validation, and initial profile setup.",
    role: "Frontend Developer",
    folderAccess: [
      "frontend/src/pages/UserRegistration.jsx",
      "frontend/src/components/forms/RegistrationForm.jsx",
    ],
    reward: 25,
    priority: "Medium",
    tags: ["frontend", "UI", "users"],
    status: "Unassigned",
  },
  {
    title: "Property Management Dashboard",
    description: "Create a dashboard for property managers to manage properties, view ongoing tasks, and access analytics on task completion and tenant satisfaction.",
    role: "Frontend Developer",
    folderAccess: [
      "frontend/src/pages/PropertyManagerDashboard.jsx",
      "frontend/src/components/dashboard/PropertyAnalytics.jsx",
    ],
    reward: 30,
    priority: "High",
    tags: ["frontend", "dashboard", "users"],
    status: "Unassigned",
  },
  {
    title: "Tenants and Businesses API",
    description: "Develop APIs for tenant and business account management, including viewing assigned tasks, updating contact details, and receiving notifications.",
    role: "Backend Developer",
    folderAccess: [
      "backend/controllers/usersController.js",
      "backend/models/User.js",
    ],
    reward: 25,
    priority: "High",
    tags: ["backend", "API", "users"],
    status: "Unassigned",
  },
  {
    title: "Role-Based User Management",
    description: "Build an admin interface and backend APIs to dynamically manage user roles (e.g., Admin, Tenant, Property Manager) and associated permissions.",
    role: "Full-Stack Developer",
    folderAccess: [
      "backend/controllers/usersController.js",
      "frontend/src/pages/AdminRoleManagement.jsx",
    ],
    reward: 35,
    priority: "High",
    tags: ["full-stack", "roles", "permissions"],
    status: "Unassigned",
  },
  {
    title: "Real-Time Notifications for Users",
    description: "Implement a notification system to deliver real-time updates about tasks, invoices, or announcements directly to the user dashboard.",
    role: "Backend Developer",
    folderAccess: [
      "backend/services/notificationService.js",
      "frontend/src/components/notifications/NotificationPanel.jsx",
    ],
    reward: 25,
    priority: "Medium",
    tags: ["backend", "notifications", "users"],
    status: "Unassigned",
  },
  {
    title: "Tenant Billing System",
    description: "Create a payment system for tenants to pay for completed tasks using integrated payment gateways like Stripe or PayPal. Include invoicing and receipt generation.",
    role: "Full-Stack Developer",
    folderAccess: [
      "backend/controllers/billingController.js",
      "frontend/src/pages/TenantBillingPage.jsx",
    ],
    reward: 40,
    priority: "High",
    tags: ["full-stack", "billing", "users"],
    status: "Unassigned",
  },
  {
    title: "User Activity Logging",
    description: "Develop a system to log user activities (e.g., login, profile update, task actions) for auditing and analysis.",
    role: "Backend Developer",
    folderAccess: [
      "backend/models/AuditLog.js",
      "backend/controllers/usersController.js",
    ],
    reward: 20,
    priority: "Medium",
    tags: ["backend", "audit", "users"],
    status: "Unassigned",
  },
  {
    title: "Multi-Language Support for Users",
    description: "Implement multi-language support for the user interface, starting with English, German, and French. Add language toggle functionality in the UI.",
    role: "Frontend Developer",
    folderAccess: [
      "frontend/src/i18n/",
      "frontend/src/components/common/LanguageToggle.jsx",
    ],
    reward: 30,
    priority: "High",
    tags: ["frontend", "UI", "internationalization"],
    status: "Unassigned",
  },
  {
    title: "User Feedback System",
    description: "Build a feedback system for users to rate completed tasks and provide comments to improve service quality.",
    role: "Full-Stack Developer",
    folderAccess: [
      "backend/controllers/feedbackController.js",
      "frontend/src/components/forms/FeedbackForm.jsx",
    ],
    reward: 30,
    priority: "Medium",
    tags: ["full-stack", "feedback", "users"],
    status: "Unassigned",
  },
];

module.exports = userManagementTasks;
