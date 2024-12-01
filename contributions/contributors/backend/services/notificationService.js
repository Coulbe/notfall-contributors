/**
 * services/notificationService.js
 * Handles the creation, management, and dispatch of notifications within the Notfall system.
 * Includes functionality for user-specific notifications, batch notifications, and alerts for suspicious activities.
 */

const Notification = require("../models/Notification");
const AuditLog = require("../models/AuditLog");
const logger = require("../utils/logger");

/**
 * Create a new notification for a user.
 * @param {String} recipient - User ID of the notification recipient.
 * @param {String} type - Notification type (e.g., TaskAssigned, TaskCompleted, SuspiciousActivity).
 * @param {String} message - Notification message content.
 * @param {String} [link] - Optional link to related resource for user context.
 */
exports.createNotification = async (recipient, type, message, link = null) => {
  try {
    const notification = new Notification({ recipient, type, message, link });
    await notification.save();
    logger.info(`Notification created for user ${recipient}: ${type}`);
  } catch (error) {
    logger.error(`Failed to create notification for user ${recipient}: ${error.message}`);
  }
};

/**
 * Notify multiple users with the same message and type.
 * @param {Array<String>} recipients - Array of user IDs to notify.
 * @param {String} type - Notification type.
 * @param {String} message - Notification message content.
 * @param {String} [link] - Optional link to related resource for user context.
 */
exports.notifyUsers = async (recipients, type, message, link = null) => {
  try {
    const notifications = recipients.map((recipient) => ({
      recipient,
      type,
      message,
      link,
    }));

    await Notification.insertMany(notifications);
    logger.info(`Notifications created for ${recipients.length} users.`);
  } catch (error) {
    logger.error(`Failed to notify users: ${error.message}`);
  }
};

/**
 * Notify administrators about suspicious activities.
 * Retrieves the audit log entry and sends notifications to all administrators.
 * @param {String} auditLogId - The ID of the suspicious audit log entry.
 */
exports.notifyAdminOfSuspiciousActivity = async (auditLogId) => {
  try {
    const log = await AuditLog.findById(auditLogId);

    if (log && log.isSuspicious) {
      const admins = await getAdmins(); // Fetch admin user IDs from the User model or another service
      const message = `Suspicious activity detected: ${log.event} on resource ${log.resource}. IP Address: ${log.ipAddress}`;

      await this.notifyUsers(
        admins,
        "SuspiciousActivity",
        message,
        `/admin/audit-log/${log._id}` // Link to the audit log entry in the admin dashboard
      );

      logger.info(`Admins notified of suspicious activity: AuditLog ID ${auditLogId}`);
    } else {
      logger.warn(`No suspicious activity found for AuditLog ID ${auditLogId}`);
    }
  } catch (error) {
    logger.error(`Failed to notify admins of suspicious activity: ${error.message}`);
  }
};

/**
 * Send a notification to all system administrators.
 * @param {String} message - The notification message to send.
 * @param {String} [link] - Optional link to related resource for admin context.
 */
exports.sendNotificationToAdmins = async (message, link = null) => {
  try {
    const admins = await getAdmins(); // Fetch admin user IDs
    await this.notifyUsers(admins, "AdminAlert", message, link);
    logger.info(`Notification sent to all admins: ${message}`);
  } catch (error) {
    logger.error(`Failed to send notification to admins: ${error.message}`);
  }
};

/**
 * Utility function to fetch admin user IDs.
 * @returns {Array<String>} - Array of admin user IDs.
 */
const getAdmins = async () => {
  const User = require("../models/User"); // Import User model dynamically to avoid circular dependencies
  const admins = await User.find({ role: "Admin" }).select("_id");
  return admins.map((admin) => admin._id.toString());
};
