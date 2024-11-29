/**
 * controllers/taskController.js
 * Handles task-related operations, including CRUD functionality, AI-based intelligent task assignment,
 * role-based task management, GitHub issue linking, and real-time notifications.
 */

const Task = require("../models/Task");
const User = require("../models/User");
const NotificationService = require("../services/notificationService");
const githubContributorService = require("../services/githubContributorService");
const logger = require("../utils/logger");
const AIModel = require("../services/aiModel"); // Import AI Model for predictions

/**
 * Helper function to log audit events for tasks.
 * This function ensures that all significant events in a task's lifecycle are tracked.
 * @param {Object} task - The task being updated.
 * @param {String} event - Description of the event (e.g., "Task created").
 * @param {ObjectId} userId - ID of the user performing the action.
 */
const logAuditEvent = (task, event, userId) => {
  task.auditLogs.push({
    event,
    performedBy: userId,
  });
};

/**
 * ===== Common Functionalities =====
 */

/**
 * Fetch all tasks in the system.
 * Only accessible by Admins and Project Managers for global monitoring.
 * @route GET /api/tasks
 * @access Admin, Project Manager
 */
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo", "username role")
      .select("-__v"); // Exclude versioning field for cleaner response
    res.status(200).json(tasks);
  } catch (error) {
    logger.error("Error fetching all tasks:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Fetch a specific task by its ID.
 * Includes populated fields for assigned user and audit logs.
 * @route GET /api/tasks/:taskId
 * @access Admin, Project Manager, Assigned Users
 */
exports.getTaskById = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findById(taskId)
      .populate("assignedTo", "username role")
      .populate("auditLogs.performedBy", "username");

    if (!task) return res.status(404).json({ message: "Task not found." });

    res.status(200).json(task);
  } catch (error) {
    logger.error("Error fetching task:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Create a new task in the system.
 * Tasks can only be created by Admins or Project Managers.
 * @route POST /api/tasks
 * @access Admin, Project Manager
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
 * Delete a task from the system.
 * This action is restricted to Admins only.
 * @route DELETE /api/tasks/:taskId
 * @access Admin
 */
exports.deleteTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findByIdAndDelete(taskId);

    if (!task) return res.status(404).json({ message: "Task not found." });

    res.status(200).json({ message: "Task deleted successfully." });
  } catch (error) {
    logger.error("Error deleting task:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * ===== AI-Powered Task Assignment =====
 */

/**
 * Match and assign tasks to the best candidate using the AI Model.
 * The AI Model predicts a match score based on factors such as skills, workload, user rating, and proximity.
 * @param {Object} task - The task to be assigned.
 * @returns {Object} - The assigned user details and updated task.
 */
const assignTaskUsingAI = async (task) => {
  try {
    // Step 1: Fetch eligible users based on the task's required skills and role
    const eligibleUsers = await User.find({
      role: task.roleReference === "Engineer" ? "Engineer" : "Contributor",
      skills: { $in: task.requiredSkills },
    });

    if (!eligibleUsers.length) {
      logger.warn(`No eligible users found for task: ${task.title}`);
      return { message: "No eligible users available for this task." };
    }

    // Step 2: Score candidates using the AI Model
    const scoredCandidates = eligibleUsers.map((user) => {
      const features = {
        skillsMatch: user.skills.filter((skill) => task.requiredSkills.includes(skill)).length,
        workload: user.currentTasks ? user.currentTasks.length : 0,
        userRating: user.rating || 0,
        proximity:
          task.location && user.location
            ? calculateProximity(task.location, user.location)
            : null, // Only for engineers
      };
      const matchScore = AIModel.predict(features); // Predict match score using AI
      return { user, matchScore };
    });

    // Step 3: Sort candidates by match score in descending order
    scoredCandidates.sort((a, b) => b.matchScore - a.matchScore);

    // Step 4: Assign the task to the highest-scoring user
    const bestCandidate = scoredCandidates[0].user;
    task.assignedTo = bestCandidate._id;
    task.status = "In Progress";

    logAuditEvent(task, `Task assigned using AI to ${bestCandidate.username}`, "System");

    await task.save();

    // Step 5: Notify the assigned user
    await NotificationService.sendNotification(
      bestCandidate._id,
      `A new task has been assigned to you: ${task.title}.`
    );

    logger.info(`Task '${task.title}' assigned to ${bestCandidate.username} using AI.`);
    return { task, assignedTo: bestCandidate };
  } catch (error) {
    logger.error(`Error assigning task using AI: ${error.message}`);
    throw new Error("Failed to assign task using AI.");
  }
};

/**
 * Assign a task using the AI Model.
 * This endpoint allows Admins and Project Managers to utilize the AI Model for assignment.
 * @route PUT /api/tasks/:taskId/assign-ai
 * @access Admin, Project Manager
 */
exports.assignTaskAI = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findById(taskId);

    if (!task) return res.status(404).json({ message: "Task not found." });

    if (task.status !== "Pending") {
      return res.status(400).json({ message: "Task is not available for AI assignment." });
    }

    const result = await assignTaskUsingAI(task);
    res.status(200).json(result);
  } catch (error) {
    logger.error("Error assigning task using AI:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * ===== Notifications =====
 * Notify users about the status of their tasks.
 * Notifications include task assignment, submission for review, and reassignment updates.
 * Implemented using the NotificationService.
 */
const sendNotificationToUsers = async (userId, message) => {
  try {
    await NotificationService.sendNotification(userId, message);
  } catch (error) {
    logger.error("Error sending notification:", error);
  }
};

/**
 * ===== Engineer-Specific Functionalities =====
 */

/**
 * Fetch available tasks for engineers to accept.
 * Engineers see tasks that match their skills and are within a certain proximity.
 * @route GET /api/tasks/available-engineers
 * @access Engineer
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
