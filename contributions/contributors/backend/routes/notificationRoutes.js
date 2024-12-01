/**
 * routes/notificationRoutes.js
 * API routes for managing notifications.
 */

const express = require("express");
const notificationController = require("../controllers/notificationController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Fetch all notifications for the logged-in user
router.get("/", authMiddleware, notificationController.getUserNotifications);

// Mark a specific notification as read
router.patch("/:id/read", authMiddleware, notificationController.markAsRead);

// Clear all notifications for the logged-in user
router.delete("/clear", authMiddleware, notificationController.clearAllNotifications);

module.exports = router;
