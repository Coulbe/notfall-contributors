/**
 * Calculates the priority of a task based on urgency and deadline proximity.
 * @param {Object} task - Task details, including `dueDate` and `urgency`.
 * @returns {number} - Priority score (higher = more urgent).
 */
const calculateTaskPriority = (task) => {
    if (!task || !task.dueDate || typeof task.urgency !== "number") {
      throw new Error("Invalid task data.");
    }
  
    const currentTime = new Date().getTime();
    const dueTime = new Date(task.dueDate).getTime();
    const timeRemaining = dueTime - currentTime;
  
    // Normalize time remaining to a score (less time = higher urgency)
    const timeFactor = timeRemaining <= 0 ? 1 : Math.max(0, 1 - timeRemaining / (1000 * 60 * 60 * 24 * 7)); // Within a week
  
    // Combine urgency and time factor (weight urgency higher)
    const priorityScore = task.urgency * 0.7 + timeFactor * 0.3;
  
    return Math.min(priorityScore, 1); // Clamp to a max of 1
  };
  
  module.exports = calculateTaskPriority;
  