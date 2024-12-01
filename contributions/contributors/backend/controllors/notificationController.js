/**
 * controllers/notificationController.js
 * Business logic for managing notifications.
 */

const Notification = require("../models/Notification");
const logger = require("../utils/logger");

/**
 * Fetch all notifications for a user.
 * @route GET /api/notifications
 */
exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50); // Limit to the latest 50 notifications

    res.status(200).json({ notifications });
  } catch (error) {
    logger.error(`Failed to fetch notifications: ${error.message}`);
    res.status(500).json({ message: "Error fetching notifications." });
  }
};

/**
 * Mark a notification as read.
 * @route PATCH /api/notifications/:id/read
 */
exports.markAsRead = async (req, res) => {
  const { id } = req.params;

  try {
    const notification = await Notification.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
    }

    res.status(200).json({ message: "Notification marked as read.", notification });
  } catch (error) {
    logger.error(`Failed to mark notification as read: ${error.message}`);
    res.status(500).json({ message: "Error updating notification." });
  }
};

/**
 * Clear all notifications for a user.
 * @route DELETE /api/notifications/clear
 */
exports.clearAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ recipient: req.user.id });

    res.status(200).json({ message: "All notifications cleared." });
  } catch (error) {
    logger.error(`Failed to clear notifications: ${error.message}`);
    res.status(500).json({ message: "Error clearing notifications." });
  }
};
