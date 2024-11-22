const AIModel = require("../services/aiModel"); // Import AI prediction model
const { calculateDistance, calculateSkillsMatch } = require("../utils/scoringUtils"); // Utilities for scoring
const EngineerModel = require("../models/engineer"); // Engineer model schema

/**
 * Match a task to the top engineers using filtering and AI-driven scoring.
 * @param {Object} task - Task details containing description, location, skills, etc.
 * @returns {Array} - List of top matching engineers.
 */
async function matchTaskToEngineers(task) {
  try {
    // Step 1: Filter engineers based on proximity, skills, and hourly rate
    let engineers = await EngineerModel.find({
      skills: { $in: task.requiredSkills }, // Check for matching skills
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [task.longitude, task.latitude] },
          $maxDistance: 10000, // 10 km radius
        },
      },
      hourlyRate: { $lte: task.hourlyRate }, // Filter by hourly rate
      availability: { $elemMatch: { date: task.date, time: task.time } }, // Match availability
    });

    // If no engineers found, return an empty array
    if (!engineers.length) {
      return [];
    }

    // Step 2: Score engineers using AI
    engineers = engineers.map((engineer) => {
      const features = {
        proximity: calculateDistance(task, engineer.location),
        hourlyRateCompatibility: task.hourlyRate - engineer.hourlyRate,
        skillsMatch: calculateSkillsMatch(task.requiredSkills, engineer.skills),
        userRating: engineer.userRating || 0,
        successRate: engineer.successRate || 0,
        urgency: task.urgency === "High" ? 1 : 0,
      };

      // Predict match score using the AI model
      engineer.matchScore = AIModel.predict(features);
      return engineer;
    });

    // Step 3: Sort engineers by match score in descending order
    engineers.sort((a, b) => b.matchScore - a.matchScore);

    // Step 4: Return the top 5 engineers
    return engineers.slice(0, 5);
  } catch (error) {
    console.error("Error in matching task to engineers:", error);
    throw new Error("Task matching failed. Please try again later.");
  }
}

module.exports = { matchTaskToEngineers };
