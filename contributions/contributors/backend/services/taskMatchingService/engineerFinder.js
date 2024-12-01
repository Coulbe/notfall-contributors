const scoreEngineer = require("../utils/scoringUtils");

/**
 * Finds the best-matched engineer for a given task.
 * @param {Object} task - Task details.
 * @param {Array<Object>} engineers - List of available engineers.
 * @param {Object} weights - Scoring weights for matching criteria.
 * @returns {Object|null} - Best-matched engineer or null if no match.
 */
const findBestEngineer = (task, engineers, weights = { skillsMatch: 0.5, workload: 0.3, location: 0.2 }) => {
  if (!task || !engineers || engineers.length === 0) {
    throw new Error("Invalid task or engineer data provided.");
  }

  let bestEngineer = null;
  let highestScore = -Infinity;

  engineers.forEach((engineer) => {
    const score = scoreEngineer(engineer, task, weights);
    if (score > highestScore) {
      highestScore = score;
      bestEngineer = engineer;
    }
  });

  return bestEngineer;
};

module.exports = findBestEngineer;
