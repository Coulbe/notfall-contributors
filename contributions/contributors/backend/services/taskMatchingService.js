const Task = require("../models/Task");
const Contributor = require("../models/Contributor");
const NotificationService = require("./notificationService");
const logger = require("../utils/logger");
const { calculateDistance, calculateSkillsMatch } = require("../utils/scoringUtils");

/**
 * Match tasks to contributors dynamically.
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
      const rankedContributors = rankContributors(task, contributors);

      if (!rankedContributors.length) {
        logger.warn(`No suitable contributors found for task: ${task.title}`);
        continue;
      }

      // Assign task to the top-ranked contributor
      const topContributor = rankedContributors[0];
      await assignTask(task, topContributor);
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
    task.status = "Awaiting Response";
    await task.save();

    // Notify the contributor
    await NotificationService.sendNotification(
      contributor._id,
      `You have been assigned a new task: ${task.title}. Please accept or reject it from your dashboard.`
    );

    logger.info(`Task '${task.title}' assigned to contributor: ${contributor.username}`);
  } catch (error) {
    logger.error(`Error assigning task '${task.title}':`, error);
  }
};

/**
 * Handle task acceptance or rejection.
 * @param {Object} task - Task object.
 * @param {String} response - "accept" or "reject"
 * @param {Object} contributor - Contributor object
 */
const handleTaskResponse = async (task, response, contributor) => {
  try {
    if (response === "accept") {
      task.status = "In Progress";
      await task.save();

      logger.info(`Task '${task.title}' accepted by ${contributor.username}.`);
      await NotificationService.sendNotification(
        contributor._id,
        `You have successfully accepted the task: ${task.title}. Start working on it now!`
      );
    } else if (response === "reject") {
      task.assignedTo = null;
      task.status = "Unassigned";
      await task.save();

      logger.warn(`Task '${task.title}' rejected by ${contributor.username}.`);
      await reassignTask(task);
    }
  } catch (error) {
    logger.error("Error handling task response:", error);
  }
};

/**
 * Reassign a task to the next best contributor.
 * @param {Object} task - Task object.
 */
const reassignTask = async (task) => {
  try {
    const contributors = await Contributor.find({ status: "Active" });
    const rankedContributors = rankContributors(task, contributors);

    if (rankedContributors.length) {
      await assignTask(task, rankedContributors[0]);
    } else {
      logger.warn(`No suitable contributors found to reassign task: ${task.title}`);
      await NotificationService.sendNotification(
        "admin",
        `Task '${task.title}' could not be reassigned. Please review manually.`
      );
    }
  } catch (error) {
    logger.error("Error reassigning task:", error);
  }
};

/**
 * Rank contributors based on workload, expertise, and proximity.
 * @param {Object} task - The task to be assigned.
 * @param {Array} contributors - List of eligible contributors.
 * @returns {Array} - Ranked contributors.
 */
const rankContributors = (task, contributors) => {
  return contributors
    .map((contributor) => ({
      ...contributor.toObject(),
      workload: contributor.currentWorkload || 0,
      expertiseMatch: calculateSkillsMatch(contributor.skills, task.requiredSkills),
      distance: calculateDistance(task.location, contributor.location),
    }))
    .sort((a, b) => {
      // Rank by workload (lower is better), expertise match (higher is better), and distance (shorter is better)
      if (a.workload !== b.workload) return a.workload - b.workload;
      if (a.expertiseMatch !== b.expertiseMatch) return b.expertiseMatch - a.expertiseMatch;
      return a.distance - b.distance;
    });
};

module.exports = {
  matchTasksToContributors,
  assignTask,
  handleTaskResponse,
};

