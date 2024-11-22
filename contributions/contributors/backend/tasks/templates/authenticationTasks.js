/**
 * templates/authenticationTasks.js
 * This file contains predefined tasks for the authentication module of the Notfall Engineers platform.
 * These tasks include API development, frontend form creation, and security features like 2FA and auditing.
 */

const authenticationTasks = [
  {
    title: "Develop Login API",
    description: "Build a secure API for user authentication using JWT tokens. Ensure the API adheres to best security practices, including hashing and token expiration.",
    role: "Backend Developer",
    folderAccess: [
      "backend/controllers/authController.js",
      "backend/middleware/authMiddleware.js",
    ],
    reward: 20,
    priority: "High",
    tags: ["backend", "authentication", "security"],
    status: "Unassigned",
  },
  {
    title: "Design Signup Page",
    description: "Create a user-friendly signup form for contributors and engineers, including validation for email, password strength, and reCAPTCHA for spam prevention.",
    role: "Frontend Developer",
    folderAccess: ["frontend/src/pages/Signup.jsx"],
    reward: 15,
    priority: "Medium",
    tags: ["frontend", "UI", "authentication"],
    status: "Unassigned",
  },
  {
    title: "Implement Social Login",
    description: "Add OAuth-based social login for Google and GitHub to simplify user registration and authentication.",
    role: "Backend Developer",
    folderAccess: [
      "backend/controllers/authController.js",
      "backend/services/socialAuthService.js",
    ],
    reward: 30,
    priority: "High",
    tags: ["backend", "OAuth", "authentication"],
    status: "Unassigned",
  },
  {
    title: "Two-Factor Authentication (2FA)",
    description: "Implement two-factor authentication (2FA) using email or mobile OTPs to add an extra layer of security to the login process.",
    role: "Backend Developer",
    folderAccess: [
      "backend/controllers/authController.js",
      "backend/services/notificationService.js",
    ],
    reward: 25,
    priority: "High",
    tags: ["backend", "security", "authentication"],
    status: "Unassigned",
  },
  {
    title: "Forgot Password Flow",
    description: "Develop a secure flow to allow users to reset their passwords via email or mobile OTP verification.",
    role: "Backend Developer",
    folderAccess: [
      "backend/controllers/authController.js",
      "backend/models/User.js",
      "backend/services/notificationService.js",
    ],
    reward: 20,
    priority: "High",
    tags: ["backend", "security", "authentication"],
    status: "Unassigned",
  },
  {
    title: "Refresh Token Mechanism",
    description: "Implement a secure refresh token mechanism to ensure long-lived sessions without compromising security.",
    role: "Backend Developer",
    folderAccess: [
      "backend/middleware/authMiddleware.js",
      "backend/controllers/authController.js",
    ],
    reward: 20,
    priority: "Medium",
    tags: ["backend", "authentication", "tokens"],
    status: "Unassigned",
  },
  {
    title: "Audit Login Attempts",
    description: "Create a system to log and audit login attempts, including IP address and device details, for enhanced security.",
    role: "Backend Developer",
    folderAccess: [
      "backend/models/AuditLog.js",
      "backend/controllers/authController.js",
    ],
    reward: 15,
    priority: "Medium",
    tags: ["backend", "security", "audit"],
    status: "Unassigned",
  },
];

// Export the tasks for integration into the task seeds
module.exports = authenticationTasks;

