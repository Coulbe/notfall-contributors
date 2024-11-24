const AIModel = require("../services/aiModel"); // Import AI prediction model
const { calculateDistance, calculateSkillsMatch } = require("../utils/scoringUtils"); // Scoring utilities
const { sendNotification } = require("../services/notificationService"); // Notification service
const EngineerModel = require("../models/Engineer"); // Engineer schema
const ContributorModel = require("../models/Contributor"); // Contributor schema
const TaskModel = require("../models/Task"); // Task schema
const logger = require("../utils/logger");
const config = require("../config/taskMatchingConfig"); // Config file for constants

/**
 * Match a task to the best candidates (engineers or contributors) using filtering and scoring.
 * @param {Object} task - Task details containing description, location, skills, etc.
 * @param {String} role - Role type (e.g., "engineer" or "contributor").
 * @returns {Array} - List of top matching candidates.
 */
async function matchTaskToCandidates(task, role) {
  try {
    logger.info(`Matching task '${task.title}' to ${role}s...`);

    const Model = role === "engineer" ? EngineerModel : ContributorModel;

    // Step 1: Filter candidates based on basic requirements
    let candidates = await Model.find({
      skills: { $in: task.requiredSkills },
      ...(role === "engineer" && {
        location: {
          $near: {
            $geometry: { type: "Point", coordinates: [task.longitude, task.latitude] },
            $maxDistance: config.PROXIMITY_RADIUS, // Configurable radius
          },
        },
        hourlyRate: { $lte: task.hourlyRate },
      }),
      availability: role === "engineer" ? task.date : true, // Engineers have time-based availability
    });

    if (!candidates.length) {
      logger.warn(`No ${role}s found for task '${task.title}'.`);
      return [];
    }

    // Step 2: Score candidates
    candidates = candidates.map((candidate) => {
      const features = {
        proximity: role === "engineer" ? calculateDistance(task, candidate.location) : null,
        hourlyRateCompatibility:
          role === "engineer" && task.hourlyRate ? task.hourlyRate - candidate.hourlyRate : null,
        skillsMatch: calculateSkillsMatch(task.requiredSkills, candidate.skills),
        workload: role === "contributor" ? candidate.currentWorkload : null,
        expertiseMatch: role === "contributor" ? calculateExpertiseMatch(candidate, task) : null,
        userRating: candidate.userRating || 0,
        successRate: candidate.successRate || 0,
        urgency: task.urgency === "High" ? config.URGENCY_WEIGHT : 0, // Configurable urgency weight
      };

      candidate.matchScore = AIModel.predict(features);
      return candidate;
    });

    // Step 3: Sort candidates by match score in descending order
    candidates.sort((a, b) => b.matchScore - a.matchScore);

    // Step 4: Filter candidates by minimum match score (configurable)
    const filteredCandidates = candidates.filter((candidate) => candidate.matchScore >= config.MIN_MATCH_SCORE);

    // Step 5: Return the top candidates (limit from config)
    return filteredCandidates.slice(0, config.TOP_CANDIDATES_LIMIT);
  } catch (error) {
    logger.error(`Error matching task '${task.title}':`, error);
    throw new Error("Task matching failed. Please try again later.");
  }
}

/**
 * Assign a task to the best-matched candidate.
 * @param {Object} task - Task object.
 * @param {Object} candidate - The best-matched candidate (engineer or contributor).
 */
async function assignTaskToCandidate(task, candidate) {
  try {
    task.assignedTo = candidate._id;
    task.status = "Awaiting Response";
    await task.save();

    // Notify the candidate
    await sendNotification(
      candidate._id,
      `You have been assigned a new task: ${task.title}. Please accept or reject it from your dashboard.`
    );

    logger.info(`Task '${task.title}' assigned to ${candidate.username}.`);
  } catch (error) {
    logger.error(`Error assigning task '${task.title}' to ${candidate.username}:`, error);
  }
}

/**
 * Handle task acceptance or rejection.
 * @param {Object} task - Task object.
 * @param {String} response - "accept" or "reject".
 * @param {Object} candidate - The candidate responding to the task.
 */
async function handleTaskResponse(task, response, candidate) {
  try {
    if (response === "accept") {
      task.status = "In Progress";
      await task.save();

      await sendNotification(
        candidate._id,
        `You have successfully accepted the task: ${task.title}. Start working on it now!`
      );
      logger.info(`Task '${task.title}' accepted by ${candidate.username}.`);
    } else if (response === "reject") {
      task.assignedTo = null;
      task.status = "Unassigned";
      await task.save();

      logger.warn(`Task '${task.title}' rejected by ${candidate.username}.`);
      await reassignTask(task);
    }
  } catch (error) {
    logger.error(`Error handling task response for task '${task.title}':`, error);
  }
}

/**
 * Reassign a task to the next best candidate.
 * @param {Object} task - Task object.
 */
async function reassignTask(task) {
  try {
    const topCandidates = await matchTaskToCandidates(task, task.role);

    if (topCandidates.length) {
      await assignTaskToCandidate(task, topCandidates[0]);
    } else {
      logger.warn(`No suitable candidates found to reassign task '${task.title}'.`);
      await sendNotification(
        "admin",
        `Task '${task.title}' could not be reassigned. Please review manually.`
      );
    }
  } catch (error) {
    logger.error(`Error reassigning task '${task.title}':`, error);
  }
}

/**
 * Main function to handle task assignment for engineers or contributors.
 * @param {String} role - Role type ("engineer" or "contributor").
 */
async function matchAndAssignTasks(role) {
  try {
    logger.info(`Starting task matching process for ${role}s...`);

    const unassignedTasks = await TaskModel.find({ status: "Unassigned" });

    if (!unassignedTasks.length) {
      logger.info("No unassigned tasks found.");
      return;
    }

    for (const task of unassignedTasks) {
      const topCandidates = await matchTaskToCandidates(task, role);

      if (!topCandidates.length) {
        logger.warn(`No suitable ${role}s found for task '${task.title}'.`);
        continue;
      }

      await assignTaskToCandidate(task, topCandidates[0]);
    }
  } catch (error) {
    logger.error("Error during task matching and assignment:", error);
  }
}

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

module.exports = {
  matchTaskToCandidates,
  assignTaskToCandidate,
  handleTaskResponse,
  matchAndAssignTasks,
};
