/**
 * Utilities for scoring and ranking engineers based on multiple criteria.
 * Provides methods to normalise data, calculate scores, and handle weighted scoring for task matching.
 */

/**
 * Normalises a value to a range of 0 to 1.
 * @param {number} value - The value to be normalised.
 * @param {number} min - The minimum value of the range.
 * @param {number} max - The maximum value of the range.
 * @returns {number} - The normalised value between 0 and 1.
 */
const normalise = (value, min, max) => {
    if (min === max) return 1; // Avoid division by zero
    return Math.max(0, Math.min(1, (value - min) / (max - min)));
  };
  
  /**
   * Computes a weighted score based on multiple features and their weights.
   * @param {Object} features - The features and their corresponding values.
   * @param {Object} weights - The weights for each feature.
   * @returns {number} - The total weighted score.
   */
  const computeWeightedScore = (features, weights) => {
    let score = 0;
    for (const [key, value] of Object.entries(features)) {
      const weight = weights[key] || 0;
      score += value * weight;
    }
    return score;
  };
  
  /**
   * Calculates proximity score based on task and engineer locations.
   * Uses Euclidean distance and normalises the result.
   * @param {Object} taskLocation - { latitude, longitude } of the task.
   * @param {Object} engineerLocation - { latitude, longitude } of the engineer.
   * @returns {number} - Proximity score normalised to 0-1.
   */
  const calculateProximity = (taskLocation, engineerLocation) => {
    const distance = Math.sqrt(
      Math.pow(taskLocation.latitude - engineerLocation.latitude, 2) +
        Math.pow(taskLocation.longitude - engineerLocation.longitude, 2)
    );
  
    // Assuming a maximum distance of 100 units for normalisation
    const maxDistance = 100;
    return normalise(maxDistance - distance, 0, maxDistance);
  };
  
  /**
   * Adjusts workload score to favour engineers with fewer tasks.
   * Inverts the workload so fewer tasks = higher score.
   * @param {number} currentTasks - Number of tasks currently assigned.
   * @param {number} maxTasks - Maximum expected number of tasks.
   * @returns {number} - Normalised workload score (lower is better).
   */
  const adjustWorkloadScore = (currentTasks, maxTasks) => {
    const invertedWorkload = maxTasks - currentTasks;
    return normalise(invertedWorkload, 0, maxTasks);
  };
  
  /**
   * Normalises hourly rate to prefer engineers with lower costs.
   * Inverts the rate so lower rates = higher scores.
   * @param {number} hourlyRate - Engineer's hourly rate.
   * @param {number} maxRate - Maximum expected hourly rate.
   * @returns {number} - Normalised cost score (lower rate = higher score).
   */
  const normaliseHourlyRate = (hourlyRate, maxRate) => {
    const invertedRate = maxRate - hourlyRate;
    return normalise(invertedRate, 0, maxRate);
  };
  
  /**
   * Scores an engineer based on provided features and weights.
   * Incorporates additional criteria like experience and certifications for advanced scoring.
   * @param {Object} engineer - Engineer's profile data.
   * @param {Object} task - Task details for matching.
   * @param {Object} weights - Weights for scoring criteria.
   * @returns {number} - Final match score for the engineer.
   */
  const scoreEngineer = (engineer, task, weights) => {
    const features = {
      skillsMatch: normalise(
        engineer.skills.filter((skill) => task.requiredSkills.includes(skill)).length,
        0,
        task.requiredSkills.length
      ),
      workload: adjustWorkloadScore(engineer.currentTasks.length, 10), // Assuming max 10 tasks
      rating: normalise(engineer.rating || 0, 0, 5),
      proximity: calculateProximity(task.location, engineer.location),
      hourlyRate: normaliseHourlyRate(engineer.hourlyRate, 100), // Assuming max hourly rate of £100
      experience: normalise(engineer.experience || 0, 0, 20), // Normalising years of experience (0-20)
      certifications: normalise(
        engineer.certifications?.length || 0,
        0,
        5
      ), // Assuming a max of 5 certifications
    };
  
    return computeWeightedScore(features, weights);
  };
  
  /**
   * Validates and adjusts weight configurations to ensure all weights sum up to 1.
   * @param {Object} weights - Weights for scoring criteria.
   * @returns {Object} - Adjusted weights.
   */
  const validateWeights = (weights) => {
    const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
    if (totalWeight === 1) return weights;
  
    return Object.keys(weights).reduce((adjusted, key) => {
      adjusted[key] = weights[key] / totalWeight;
      return adjusted;
    }, {});
  };
  
  /**
   * Provides default weights for scoring if not explicitly defined.
   * @returns {Object} - Default weights.
   */
  const getDefaultWeights = () => ({
    skillsMatch: 0.4,
    workload: -0.2,
    rating: 0.3,
    proximity: 0.2,
    hourlyRate: -0.1,
    experience: 0.15,
    certifications: 0.05,
  });
  
  module.exports = {
    normalise,
    computeWeightedScore,
    calculateProximity,
    adjustWorkloadScore,
    normaliseHourlyRate,
    scoreEngineer,
    validateWeights,
    getDefaultWeights,
  };
  