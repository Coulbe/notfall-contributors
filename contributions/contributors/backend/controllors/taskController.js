const Task = require("../models/Task");
const GitHubIssue = require("../models/GitHubIssue");
const AuditLog = require("../models/AuditLog");
const User = require("../models/User");
const NotificationService = require("../services/notificationService");
const githubIssueService = require("../services/githubIssueService");
const AIModel = require("../services/aiModel");
const findBestEngineer = require("../taskMatchingService/engineerFinder");
const calculateTaskPriority = require("../taskMatchingService/taskPriority");
const { sendTaskAssignmentNotification } = require("../taskMatchingService/notificationHandler");
const logger = require("../utils/logger");


/**
 * Helper function to log audit events for tasks.
 * Tracks significant changes and interactions with tasks.
 * @param {Object} task - The task being updated.
 * @param {String} event - Description of the event (e.g., "Task assigned").
 * @param {ObjectId} userId - ID of the user performing the action.
 * @param {String} ipAddress - IP address of the user performing the action.
 * @param {Object} additionalDetails - Optional metadata for the log entry.
 */
const logAuditEvent = async (task, event, userId, ipAddress, additionalDetails = {}) => {
  try {
    await AuditLog.create({
      userId,
      action: event,
      resource: "Task",
      resourceId: task._id,
      details: additionalDetails,
      ipAddress,
    });
    logger.info(`Audit log created for task ${task._id}: ${event}`);
  } catch (error) {
    logger.error("Error logging audit event:", error);
  }
};

/**
 * ===== CRUD Operations =====
 */

/**
 * Fetch all tasks.
 * Admins and Project Managers can view all tasks to monitor progress or assign tasks.
 * Supports optional query filters like status and priority.
 * @route GET /api/tasks
 * @access Admin, Project Manager
 */
exports.getAllTasks = async (req, res) => {
  const { status, priority } = req.query;
  const filter = {};

  if (status) filter.status = status;
  if (priority) filter.priority = priority;

  try {
    const tasks = await Task.find(filter)
      .populate("assignedTo", "username role")
      .select("-__v");
    res.status(200).json(tasks);
  } catch (error) {
    logger.error("Error fetching all tasks:", error);
    res.status(500).json({ message: "Error fetching tasks. Please try again later." });
  }
};

/**
 * Fetch a specific task by ID.
 * Includes populated fields for assigned user and audit logs for transparency.
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
    res.status(500).json({ message: "Error fetching task. Please try again later." });
  }
};

/**
 * Create a new task.
 * Allows Admins and Project Managers to create tasks for contributors or engineers.
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

    await newTask.save();
    await logAuditEvent(newTask, "Task created", req.user.id, req.ip);
    res.status(201).json({ message: "Task created successfully.", task: newTask });
  } catch (error) {
    logger.error("Error creating task:", error);
    res.status(500).json({ message: "Error creating task. Please try again later." });
  }
};

/**
 * Update a task.
 * Allows Admins and Project Managers to modify task details.
 * @route PUT /api/tasks/:taskId
 * @access Admin, Project Manager
 */
exports.updateTask = async (req, res) => {
  const { taskId } = req.params;
  const updates = req.body;
  const ipAddress = req.ip;

  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found." });

    const oldData = { title: task.title, description: task.description, status: task.status };
    Object.assign(task, updates);
    await task.save();

    await logAuditEvent(task, "Task updated", req.user.id, ipAddress, { oldData, newData: updates });
    res.status(200).json({ message: "Task updated successfully.", task });
  } catch (error) {
    logger.error("Error updating task:", error);
    res.status(500).json({ message: "Error updating task. Please try again later." });
  }
};

/**
 * Delete a task.
 * Restricted to Admins to ensure tasks are not accidentally removed.
 * @route DELETE /api/tasks/:taskId
 * @access Admin
 */
exports.deleteTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findByIdAndDelete(taskId);
    if (!task) return res.status(404).json({ message: "Task not found." });

    await logAuditEvent(task, "Task deleted", req.user.id, req.ip);
    res.status(200).json({ message: "Task deleted successfully." });
  } catch (error) {
    logger.error("Error deleting task:", error);
    res.status(500).json({ message: "Error deleting task. Please try again later." });
  }
};

/**
 * ===== GitHub Integration =====
 */

/**
 * Link a system task with a GitHub issue.
 * Provides traceability between Notfall tasks and GitHub issues.
 * @route POST /api/tasks/:taskId/link-github
 * @access Admin, Project Manager
 */
exports.linkTaskToGitHubIssue = async (req, res) => {
  const { taskId } = req.params;
  const { issueNumber } = req.body;

  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found." });

    const issue = await githubIssueService.getIssue(issueNumber);
    if (!issue) return res.status(404).json({ message: "GitHub issue not found." });

    task.githubIssue = issue.html_url;
    await task.save();

    const linkedIssue = new GitHubIssue({
      taskId: task._id,
      issueNumber: issue.number,
      url: issue.html_url,
      title: issue.title,
    });
    await linkedIssue.save();

    await logAuditEvent(task, "GitHub issue linked", req.user.id, req.ip, { issueNumber });
    res.status(200).json({ message: "Task linked to GitHub issue successfully.", task });
  } catch (error) {
    logger.error("Error linking task to GitHub issue:", error);
    res.status(500).json({ message: "Error linking task to GitHub issue. Please try again later." });
  }
};

/**
 * ===== AI-Powered Task Assignment =====
 */

/**
 * Assign a task to the best candidate using AI predictions.
 * Analyzes user skills, workload, and ratings for the best match.
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
 * AI logic for task assignment.
 * Matches eligible users to tasks using an AI scoring model.
 * @param {Object} task - The task to be assigned.
 * @returns {Object} - Task and assigned user details.
 */
const assignTaskUsingAI = async (task) => {
  try {
    const eligibleUsers = await User.find({
      role: task.roleReference === "Engineer" ? "Engineer" : "Contributor",
      skills: { $in: task.requiredSkills },
    });

    if (!eligibleUsers.length) {
      logger.warn(`No eligible users found for task: ${task.title}`);
      return { message: "No eligible users available for this task." };
    }

    const scoredCandidates = eligibleUsers.map((user) => {
      const features = {
        skillsMatch: user.skills.filter((skill) => task.requiredSkills.includes(skill)).length,
        workload: user.currentTasks ? user.currentTasks.length : 0,
        userRating: user.rating || 0,
      };
      return { user, matchScore: AIModel.predict(features) };
    });

    scoredCandidates.sort((a, b) => b.matchScore - a.matchScore);

    const bestCandidate = scoredCandidates[0].user;
    task.assignedTo = bestCandidate._id;
    task.status = "In Progress";

    await task.save();
    await logAuditEvent(task, "Task assigned using AI", "System", null, { assignedTo: bestCandidate.username });
    await NotificationService.sendNotification(bestCandidate._id, `A new task has been assigned to you: ${task.title}.`);

    return { task, assignedTo: bestCandidate };
  } catch (error) {
    logger.error("Error in AI task assignment:", error);
    throw new Error("Failed to assign task using AI.");
  }
};

/**
 * ===== Suspicious Activities =====
 */

/**
 * Flag suspicious actions on a task.
 * Logs unusual task interactions for compliance review.
 * @route POST /api/tasks/:taskId/flag-suspicious
 * @access Admin, Project Manager
 */
exports.flagSuspiciousAction = async (req, res) => {
  const { taskId } = req.params;
  const ipAddress = req.ip;

  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found." });

    await logAuditEvent(task, "Suspicious action flagged", req.user.id, ipAddress, {
      message: "Suspicious activity detected.",
    });

    res.status(200).json({ message: "Suspicious activity logged." });
  } catch (error) {
    logger.error("Error flagging suspicious activity:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

