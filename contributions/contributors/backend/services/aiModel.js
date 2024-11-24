/**
 * aiModel.js
 * Advanced AI Model for scoring and ranking candidates for tasks.
 */

const logger = require("../utils/logger"); // Logger for debugging and insights

class AIModel {
  /**
   * Default weights for scoring features.
   * Adjust weights dynamically for different roles or task types.
   */
  static defaultWeights = {
    proximity: 0.25,
    hourlyRateCompatibility: 0.15,
    skillsMatch: 0.3,
    userRating: 0.1,
    successRate: 0.1,
    urgency: 0.05,
    expertiseMatch: 0.05,
    workload: -0.1, // Negative impact for higher workload
  };

  /**
   * Predict a match score for a candidate based on input features.
   * @param {Object} features - Scoring parameters (e.g., proximity, skills match, etc.).
   * @param {Object} customWeights - Custom weights for scoring (optional).
   * @returns {Number} - Predicted score (0 to 1).
   */
  static predict(features, customWeights = null) {
    const weights = customWeights || AIModel.defaultWeights;

    // Extract and normalize features
    const normalizedFeatures = AIModel.normalizeFeatures(features);

    // Calculate weighted score
    let score = 0;
    for (const key in normalizedFeatures) {
      if (weights[key]) {
        score += normalizedFeatures[key] * weights[key];
      }
    }

    // Normalize final score to the range [0, 1]
    const normalizedScore = Math.max(0, Math.min(1, score));

    // Log scoring details for debugging
    logger.info(`Scoring details: ${JSON.stringify({ features, normalizedFeatures, weights, normalizedScore })}`);

    return normalizedScore;
  }

  /**
   * Normalize input features to ensure consistency in scoring.
   * @param {Object} features - Raw feature values.
   * @returns {Object} - Normalized feature values.
   */
  static normalizeFeatures(features) {
    const {
      proximity = 0, // Assume values in km
      hourlyRateCompatibility = 0, // Difference in hourly rates
      skillsMatch = 0, // Ratio of matched skills
      userRating = 0, // Rating out of 5
      successRate = 0, // Percentage of successful tasks
      urgency = 0, // Binary (0 or 1)
      expertiseMatch = 0, // Ratio of matching expertise
      workload = 0, // Number of tasks currently assigned
    } = features;

    return {
      proximity: 1 - Math.min(proximity / 10, 1), // Normalize distance (closer = better)
      hourlyRateCompatibility: Math.max(-1, Math.min(hourlyRateCompatibility / 100, 1)), // Normalize rate difference
      skillsMatch: Math.max(0, Math.min(skillsMatch, 1)), // Already a ratio
      userRating: Math.max(0, Math.min(userRating / 5, 1)), // Normalize to [0, 1]
      successRate: Math.max(0, Math.min(successRate / 100, 1)), // Normalize percentage
      urgency, // Binary, already normalized
      expertiseMatch: Math.max(0, Math.min(expertiseMatch, 1)), // Already a ratio
      workload: Math.max(-1, Math.min(-workload / 10, 0)), // Higher workload reduces score
    };
  }

  /**
   * Adjust weights dynamically based on task type or role.
   * @param {String} taskType - Type of task (e.g., "High Priority").
   * @returns {Object} - Adjusted weights.
   */
  static adjustWeights(taskType) {
    const customWeights = { ...AIModel.defaultWeights };

    switch (taskType) {
      case "High Priority":
        customWeights.urgency = 0.15;
        customWeights.proximity = 0.2;
        break;
      case "Complex Task":
        customWeights.skillsMatch = 0.4;
        customWeights.expertiseMatch = 0.1;
        break;
      default:
        break; // Use default weights
    }

    logger.info(`Weights adjusted for task type '${taskType}': ${JSON.stringify(customWeights)}`);
    return customWeights;
  }

  /**
   * Filter candidates with a minimum score threshold.
   * @param {Array} candidates - List of candidates with their scores.
   * @param {Number} threshold - Minimum score threshold.
   * @returns {Array} - Filtered candidates.
   */
  static filterCandidates(candidates, threshold = 0.5) {
    const filtered = candidates.filter((candidate) => candidate.matchScore >= threshold);
    logger.info(`Candidates filtered by threshold ${threshold}: ${filtered.length} passed`);
    return filtered;
  }
}

module.exports = AIModel;
