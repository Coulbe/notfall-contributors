const Task = require("../models/Task");
const User = require("../models/User");
const NotificationService = require("../services/notificationService");
const logger = require("../utils/logger");

/**
 * Get tasks assigned to an engineer.
 */
exports.getAssignedTasksForEngineer = async (req, res) => {
  try {
    if (req.user.role !== "Engineer") {
      return res.status(403).json({ message: "Access denied: Only engineers can view tasks." });
    }

    const tasks = await Task.find({ assignedTo: req.user.id })
      .select("-__v")
      .sort({ dueDate: 1 }); // Sort by earliest due date

    res.status(200).json({ tasks });
  } catch (error) {
    logger.error("Error fetching assigned tasks for engineer:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Accept a task (Engineer only).
 */
exports.acceptTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findById(taskId);

    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.status !== "Pending") {
      return res.status(400).json({ message: "Task is no longer available for acceptance." });
    }

    if (task.assignedTo && String(task.assignedTo) !== String(req.user.id)) {
      return res.status(400).json({ message: "Task is assigned to another engineer." });
    }

    task.status = "In Progress";
    task.assignedTo = req.user.id;
    task.auditLogs.push({
      event: "Task accepted",
      performedBy: req.user.id,
    });

    await task.save();

    await NotificationService.sendNotification(
      "admin",
      `Engineer ${req.user.username} accepted task: ${task.title}.`
    );

    logger.info(`Task '${task.title}' accepted by engineer ${req.user.username}`);
    res.status(200).json({ message: "Task accepted successfully.", task });
  } catch (error) {
    logger.error("Error accepting task:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Reject a task (Engineer only).
 */
exports.rejectTask = async (req, res) => {
  const { taskId } = req.params;
  const { reason } = req.body;

  try {
    const task = await Task.findById(taskId);

    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.status !== "Pending") {
      return res.status(400).json({ message: "Task is no longer available for rejection." });
    }

    task.status = "Rejected";
    task.auditLogs.push({
      event: `Task rejected with reason: ${reason}`,
      performedBy: req.user.id,
    });

    await task.save();

    await NotificationService.sendNotification(
      "admin",
      `Engineer ${req.user.username} rejected task: ${task.title}. Reason: ${reason}`
    );

    logger.info(`Task '${task.title}' rejected by engineer ${req.user.username}`);
    res.status(200).json({ message: "Task rejected successfully.", task });

    // Optionally reassign the task
    await reassignTask(task);
  } catch (error) {
    logger.error("Error rejecting task:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Mark a task as completed (Engineer only).
 */
exports.completeTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findById(taskId);

    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.assignedTo.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Access denied: This task is not assigned to you." });
    }

    if (task.status !== "In Progress") {
      return res.status(400).json({ message: "Only tasks in progress can be marked as completed." });
    }

    task.status = "Completed";
    task.completionDate = new Date();
    task.auditLogs.push({
      event: "Task completed",
      performedBy: req.user.id,
    });

    await task.save();

    await NotificationService.sendNotification(
      "admin",
      `Engineer ${req.user.username} completed task: ${task.title}.`
    );

    logger.info(`Task '${task.title}' completed by engineer ${req.user.username}`);
    res.status(200).json({ message: "Task marked as completed.", task });
  } catch (error) {
    logger.error("Error marking task as completed:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update task progress (Engineer only).
 */
exports.updateTaskProgress = async (req, res) => {
  const { taskId } = req.params;
  const { progressDetails } = req.body;

  try {
    const task = await Task.findById(taskId);

    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.assignedTo.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Access denied: This task is not assigned to you." });
    }

    if (task.status !== "In Progress") {
      return res.status(400).json({ message: "Progress updates can only be made for tasks in progress." });
    }

    task.auditLogs.push({
      event: `Task progress updated: ${progressDetails}`,
      performedBy: req.user.id,
    });

    await task.save();

    logger.info(`Task '${task.title}' progress updated by engineer ${req.user.username}`);
    res.status(200).json({ message: "Task progress updated successfully.", task });
  } catch (error) {
    logger.error("Error updating task progress:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Reassign a rejected task.
 */
const reassignTask = async (task) => {
  try {
    const eligibleEngineers = await User.find({
      role: "Engineer",
      skills: { $in: task.requiredSkills },
      _id: { $ne: task.assignedTo }, // Exclude the rejecting engineer
    });

    if (!eligibleEngineers.length) {
      logger.warn(`No engineers available for reassignment of task: ${task.title}`);
      return;
    }

    const nextEngineer = eligibleEngineers[0]; // Replace with scoring logic if required
    task.assignedTo = nextEngineer._id;
    task.status = "Pending";

    await task.save();

    await NotificationService.sendNotification(
      nextEngineer._id,
      `You have been reassigned the task: ${task.title}.`
    );

    logger.info(`Task '${task.title}' reassigned to engineer ${nextEngineer.username}`);
  } catch (error) {
    logger.error("Error reassigning task:", error);
  }
};
