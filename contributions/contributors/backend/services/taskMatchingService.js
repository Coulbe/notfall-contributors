/**
 * taskMatchingService.js
 * Advanced service for dynamic task assignment in the Notfall Contributors system.
 */

const Task = require("../models/Task");
const Contributor = require("../models/Contributor");
const NotificationService = require("./notificationService");
const logger = require("../utils/logger");

/**
 * Match unassigned tasks to the best contributors dynamically.
 */
const matchTasksToContributors = async () => {
  try {
    logger.info("Starting task matching process...");

    // Step 1: Fetch all unassigned tasks
    const unassignedTasks = await Task.find({ status: "Unassigned" });
    if (!unassignedTasks.length) {
      logger.info("No unassigned tasks found.");
      return;
    }

    // Step 2: Fetch all active contributors
    const contributors = await Contributor.find({ status: "Active" });
    if (!contributors.length) {
      logger.warn("No active contributors found.");
      return;
    }

    // Step 3: Process each task for assignment
    for (const task of unassignedTasks) {
      // Filter contributors by role
      const eligibleContributors = contributors.filter((contributor) =>
        contributor.roles.includes(task.role)
      );

      if (!eligibleContributors.length) {
        logger.warn(`No contributors with the required role found for task: ${task.title}`);
        continue;
      }

      // Filter contributors by folder access
      const accessibleContributors = eligibleContributors.filter((contributor) =>
        task.folderAccess.every((folder) => contributor.folderAccess.includes(folder))
      );

      if (!accessibleContributors.length) {
        logger.warn(`No contributors with folder access found for task: ${task.title}`);
        continue;
      }

      // Step 4: Rank contributors
      const rankedContributors = rankContributors(task, accessibleContributors);

      if (!rankedContributors.length) {
        logger.warn(`No suitable contributors found for task: ${task.title}`);
        continue;
      }

      // Step 5: Assign task to the best contributor
      const bestContributor = rankedContributors[0];
      await assignTask(task, bestContributor);
    }
  } catch (error) {
    logger.error("Error during task matching:", error);
  }
};

/**
 * Assign a task to a contributor.
 * @param {Object} task - Task object.
 * @param {Object} contributor - Contributor object.
 */
const assignTask = async (task, contributor) => {
  try {
    task.assignedTo = contributor._id;
    task.status = "In Progress";
    await task.save();

    // Notify the contributor
    await NotificationService.sendNotification(
      contributor._id,
      `You have been assigned a new task: ${task.title}. Check your dashboard for details.`
    );

    logger.info(`Task '${task.title}' assigned to contributor: ${contributor.username}`);
  } catch (error) {
    logger.error(`Error assigning task '${task.title}':`, error);
  }
};

/**
 * Rank contributors based on workload, expertise, and task priority.
 * @param {Object} task - The task to be assigned.
 * @param {Array} contributors - List of eligible contributors.
 * @returns {Array} - Ranked contributors.
 */
const rankContributors = (task, contributors) => {
  return contributors
    .map((contributor) => ({
      ...contributor.toObject(),
      workload: contributor.currentWorkload,
      expertiseMatch: calculateExpertiseMatch(contributor, task),
      priorityWeight: calculatePriorityWeight(task.priority),
    }))
    .sort((a, b) => {
      // Rank by workload, then expertise match, then priority weight
      if (a.workload !== b.workload) return a.workload - b.workload;
      if (a.expertiseMatch !== b.expertiseMatch) return b.expertiseMatch - a.expertiseMatch;
      return b.priorityWeight - a.priorityWeight;
    });
};

/**
 * Calculate expertise match score for a contributor.
 * @param {Object} contributor - Contributor object.
 * @param {Object} task - Task object.
 * @returns {Number} - Expertise match score.
 */
const calculateExpertiseMatch = (contributor, task) => {
  const matchingTags = contributor.skills.filter((skill) => task.tags.includes(skill));
  return matchingTags.length / task.tags.length;
};

/**
 * Calculate priority weight for a task.
 * @param {String} priority - Task priority (Low, Medium, High).
 * @returns {Number} - Priority weight.
 */
const calculatePriorityWeight = (priority) => {
  const weights = { Low: 1, Medium: 2, High: 3 };
  return weights[priority] || 1;
};

/**
 * Fallback strategy for unassigned tasks.
 * @param {Object} task - Task object.
 */
const handleUnassignedTask = async (task) => {
  logger.warn(`Task '${task.title}' remains unassigned after matching.`);
  task.status = "Pending";
  await task.save();

  // Notify admins
  await NotificationService.sendNotification(
    "admin",
    `Task '${task.title}' could not be assigned. Please review manually.`
  );
};

module.exports = {
  matchTasksToContributors,
  assignTask,
};
