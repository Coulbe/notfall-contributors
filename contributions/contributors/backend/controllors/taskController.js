const Task = require("../models/Task");
const User = require("../models/User");
const NotificationService = require("../services/notificationService");
const logger = require("../utils/logger");

/**
 * Helper function to log audit events for tasks.
 * @param {Object} task - The task being updated.
 * @param {String} event - The event description.
 * @param {ObjectId} userId - The user performing the action.
 */
const logAuditEvent = (task, event, userId) => {
  task.auditLogs.push({
    event,
    performedBy: userId,
  });
};

//
// ===== Shared Functionalities =====
//

/**
 * Fetch all tasks (Admin or Project Manager only).
 */
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo", "username role")
      .select("-__v");

    res.status(200).json(tasks);
  } catch (error) {
    logger.error("Error fetching all tasks:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Fetch a single task by ID.
 */
exports.getTaskById = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findById(taskId)
      .populate("assignedTo", "username role")
      .populate("auditLogs.performedBy", "username");

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.status(200).json(task);
  } catch (error) {
    logger.error("Error fetching task:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Create a new task (Admin or Project Manager only).
 */
exports.createTask = async (req, res) => {
  const { title, description, role, requiredSkills, folderAccess, priority, tags, dueDate } = req.body;

  try {
    const newTask = new Task({
      title,
      description,
      role,
      requiredSkills,
      folderAccess,
      priority,
      tags,
      dueDate,
      createdBy: req.user.id,
    });

    logAuditEvent(newTask, "Task created", req.user.id);

    await newTask.save();

    res.status(201).json({ message: "Task created successfully.", task: newTask });
  } catch (error) {
    logger.error("Error creating task:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Delete a task (Admin only).
 */
exports.deleteTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findByIdAndDelete(taskId);

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.status(200).json({ message: "Task deleted successfully." });
  } catch (error) {
    logger.error("Error deleting task:", error);
    res.status(500).json({ message: error.message });
  }
};

//
// ===== Contributor-Specific Functionalities =====
//

/**
 * Assign a task to a contributor (Admin or Project Manager only).
 */
exports.assignTaskToContributor = async (req, res) => {
  const { taskId } = req.params;
  const { contributorId } = req.body;

  try {
    const task = await Task.findById(taskId);
    const contributor = await User.findById(contributorId);

    if (!task) return res.status(404).json({ message: "Task not found" });
    if (!contributor) return res.status(404).json({ message: "Contributor not found" });

    task.assignedTo = contributor._id;
    task.status = "In Progress";

    logAuditEvent(task, "Task assigned to contributor", req.user.id);

    await task.save();

    await NotificationService.sendNotification(
      contributor._id,
      `A new task has been assigned: ${task.title}. Check your dashboard for details.`
    );

    res.status(200).json({ message: "Task assigned to contributor successfully.", task });
  } catch (error) {
    logger.error("Error assigning task to contributor:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Submit task for review (Contributor only).
 */
exports.submitTaskForReview = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findById(taskId);

    if (!task) return res.status(404).json({ message: "Task not found" });

    if (String(task.assignedTo) !== String(req.user.id)) {
      return res.status(403).json({ message: "This task is not assigned to you." });
    }

    task.status = "Pending Review";

    logAuditEvent(task, "Task submitted for review", req.user.id);

    await task.save();

    res.status(200).json({ message: "Task submitted for review.", task });
  } catch (error) {
    logger.error("Error submitting task for review:", error);
    res.status(500).json({ message: error.message });
  }
};

//
// ===== Engineer-Specific Functionalities =====
//

/**
 * Fetch tasks available for engineers to accept.
 */
exports.getAvailableTasksForEngineers = async (req, res) => {
  try {
    if (req.user.role !== "Engineer") {
      return res.status(403).json({ message: "Access denied: Only engineers can view tasks." });
    }

    const tasks = await Task.find({
      status: "Pending",
      requiredSkills: { $in: req.user.skills },
    });

    res.status(200).json({ tasks });
  } catch (error) {
    logger.error("Error fetching available tasks for engineers:", error);
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

    task.status = "In Progress";
    task.assignedTo = req.user.id;

    logAuditEvent(task, "Task accepted", req.user.id);

    await task.save();

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

    task.status = "Rejected";

    logAuditEvent(task, `Task rejected: ${reason}`, req.user.id);

    await task.save();

    res.status(200).json({ message: "Task rejected successfully.", task });

    // Automatically reassign the task
    await reassignRejectedTask(task);
  } catch (error) {
    logger.error("Error rejecting task:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Reassign a rejected task to another user.
 */
const reassignRejectedTask = async (task) => {
  try {
    const eligibleUsers = await User.find({
      role: task.roleReference === "Engineer" ? "Engineer" : "Contributor",
      skills: { $in: task.requiredSkills },
    });

    if (!eligibleUsers.length) {
      logger.warn(`No eligible users found to reassign task: ${task.title}`);
      return;
    }

    const bestUser = eligibleUsers[0]; // Add logic to determine the best match

    task.assignedTo = bestUser._id;
    task.status = "Pending";

    logAuditEvent(task, "Task reassigned to another user", "System");

    await task.save();

    await NotificationService.sendNotification(
      bestUser._id,
      `A new task has been reassigned to you: ${task.title}.`
    );
  } catch (error) {
    logger.error("Error reassigning rejected task:", error);
  }
};
