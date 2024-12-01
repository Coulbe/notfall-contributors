const { sendNotification } = require("../services/notificationService");

/**
 * Sends a task assignment notification to an engineer.
 * @param {string} engineerId - ID of the engineer to notify.
 * @param {Object} task - Task details for the notification.
 * @returns {Promise<void>}
 */
const sendTaskAssignmentNotification = async (engineerId, task) => {
  if (!engineerId || !task) {
    throw new Error("Engineer ID and task details are required.");
  }

  const message = `You have been assigned a new task: "${task.title}". Please review the details and confirm acceptance.`;
  try {
    await sendNotification(engineerId, message);
    console.log(`Notification sent to engineer ${engineerId} for task "${task.title}".`);
  } catch (error) {
    console.error("Failed to send task assignment notification:", error.message);
  }
};

/**
 * Sends a task update notification to a user.
 * @param {string} userId - ID of the user to notify.
 * @param {Object} task - Updated task details.
 * @returns {Promise<void>}
 */
const sendTaskUpdateNotification = async (userId, task) => {
  if (!userId || !task) {
    throw new Error("User ID and task details are required.");
  }

  const message = `Task "${task.title}" has been updated. Please review the changes.`;
  try {
    await sendNotification(userId, message);
    console.log(`Notification sent to user ${userId} for task "${task.title}".`);
  } catch (error) {
    console.error("Failed to send task update notification:", error.message);
  }
};

module.exports = {
  sendTaskAssignmentNotification,
  sendTaskUpdateNotification,
};
