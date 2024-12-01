// Import necessary modules and models
const Engineer = require("../models/Engineer");
const Task = require("../models/Task");
const NotificationService = require("./notificationService");
const logger = require("../utils/logger");

/**
 * Assigns a task to an available engineer in real-time.
 * @param {ObjectId} taskId - The ID of the task to be assigned.
 * @returns {Promise<Object>} - The task and assigned engineer details.
 */
const dispatchEngineer = async (taskId) => {
  try {
    // Fetch the task details
    const task = await Task.findById(taskId).populate("requiredSkills");
    if (!task) throw new Error("Task not found");

    if (task.status !== "Pending") {
      throw new Error("Task is not available for dispatch");
    }

    // Find available engineers matching the task's requirements
    const engineers = await Engineer.find({
      skills: { $in: task.requiredSkills },
      availability: true, // Ensures engineer is available
      status: "Active", // Ensures engineer is active
    }).sort({ currentTasks: 1 }); // Prefer engineers with fewer tasks

    if (!engineers.length) {
      logger.warn(`No available engineers found for task: ${task.title}`);
      return { message: "No engineers available for this task" };
    }

    // Select the best match engineer
    const assignedEngineer = engineers[0];

    // Update the task and engineer details
    task.assignedTo = assignedEngineer._id;
    task.status = "In Progress";
    assignedEngineer.currentTasks.push(task._id);

    await Promise.all([task.save(), assignedEngineer.save()]);

    // Send notification to the engineer
    await NotificationService.sendNotification(
      assignedEngineer._id,
      `You have been assigned a new task: ${task.title}`
    );

    logger.info(
      `Task '${task.title}' successfully assigned to Engineer '${assignedEngineer.name}'`
    );
    return {
      task,
      assignedEngineer,
    };
  } catch (error) {
    logger.error("Error in dispatching engineer:", error.message);
    throw new Error(error.message);
  }
};

/**
 * Sends real-time updates for the task dispatch process.
 * @param {ObjectId} taskId - The ID of the task to send updates for.
 * @param {string} updateMessage - The message to send.
 * @returns {Promise<void>}
 */
const sendRealTimeUpdate = async (taskId, updateMessage) => {
  try {
    // Simulate sending a real-time update via WebSocket or similar service
    // This function can be integrated with tools like Socket.io or Firebase
    logger.info(`Real-time update for task ${taskId}: ${updateMessage}`);
  } catch (error) {
    logger.error("Error sending real-time update:", error.message);
    throw new Error(error.message);
  }
};

/**
 * Handles retry logic for dispatching engineers if no one accepts the task.
 * @param {ObjectId} taskId - The ID of the task.
 * @param {number} maxRetries - Maximum number of retry attempts.
 * @returns {Promise<Object>} - The task status after retries.
 */
const retryDispatch = async (taskId, maxRetries = 3) => {
  let attempt = 0;

  while (attempt < maxRetries) {
    const result = await dispatchEngineer(taskId);
    if (result.assignedEngineer) {
      return result;
    }
    attempt++;
    logger.info(`Retrying dispatch for task ${taskId}, attempt ${attempt}`);
  }

  logger.warn(`Task ${taskId} could not be assigned after ${maxRetries} retries`);
  return { message: "Task could not be assigned. Please try again later." };
};

// Export the service functions
module.exports = {
  dispatchEngineer,
  sendRealTimeUpdate,
  retryDispatch,
};
