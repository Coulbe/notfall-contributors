/**
 * config/taskMatchingConfig.js
 * Configuration file for task matching parameters and constants.
 * This file defines all configurable parameters for the task matching service,
 * including thresholds, scoring weights, and system limits.
 */

module.exports = {
  // ===================== Matching Criteria =====================
  /**
   * Proximity radius for geographical matching (in meters).
   * Determines the distance within which engineers can be matched to tasks.
   */
  PROXIMITY_RADIUS: 10000, // 10 km

  /**
   * Minimum score threshold for candidates to qualify.
   * Filters out candidates whose match score falls below this value.
   */
  MIN_MATCH_SCORE: 0.5,

  /**
   * Limit on the number of top candidates returned per task match.
   * Ensures only the most suitable candidates are considered for assignment.
   */
  TOP_CANDIDATES_LIMIT: 5,

  /**
   * Default hourly rate threshold for engineer matching.
   * Engineers with hourly rates higher than this value are excluded.
   */
  DEFAULT_HOURLY_RATE_THRESHOLD: 50, // Currency value

  // ===================== Scoring Weights =====================
  /**
   * Weight assigned to task urgency during scoring.
   * Higher urgency tasks are prioritized when ranking candidates.
   */
  URGENCY_WEIGHT: 1,

  /**
   * Weight assigned to skill compatibility during scoring.
   * Ensures tasks are matched to candidates with the most relevant skills.
   */
  SKILLS_MATCH_WEIGHT: 2,

  /**
   * Weight assigned to proximity (engineers only).
   * Favors engineers located closer to the task's geographical location.
   */
  PROXIMITY_WEIGHT: 1.5,

  /**
   * Weight assigned to hourly rate compatibility (engineers only).
   * Encourages cost-effective engineer matching within budget constraints.
   */
  HOURLY_RATE_COMPATIBILITY_WEIGHT: 1,

  /**
   * Weight assigned to workload when ranking contributors.
   * Ensures contributors with lower workloads are prioritized for new tasks.
   */
  WORKLOAD_WEIGHT: -1, // Negative value indicates that lower workload is better.

  // ===================== Task Reassignment =====================
  /**
   * Maximum number of retries for reassigning a task.
   * Limits how many times the system attempts to reassign a rejected task.
   */
  REASSIGNMENT_RETRY_LIMIT: 3,

  /**
   * Delay before attempting to reassign a rejected task (in milliseconds).
   * Prevents immediate reassignment, giving the system time to adjust.
   */
  REASSIGNMENT_DELAY: 30000, // 30 seconds

  // ===================== Notifications =====================
  /**
   * Predefined notification types for task-related events.
   * Standardizes messaging for users across the system.
   */
  NOTIFICATION_TYPES: {
    ASSIGNMENT: "assignment",
    ACCEPTANCE: "acceptance",
    REJECTION: "rejection",
    REASSIGNMENT: "reassignment",
    ADMIN_ALERT: "admin_alert",
  },

  // ===================== System Limits =====================
  /**
   * Maximum workload threshold for contributors.
   * Prevents contributors from being overwhelmed with too many tasks.
   */
  MAX_WORKLOAD_THRESHOLD: 5, // Maximum number of concurrent tasks.

  /**
   * Maximum number of audit logs stored per task.
   * Older logs are archived to maintain database efficiency.
   */
  MAX_AUDIT_LOGS: 50,

  // ===================== Logging and Monitoring =====================
  /**
   * Logging levels for the task matching system.
   * Enables dynamic logging based on severity levels.
   */
  LOGGING_LEVEL: {
    INFO: "info",
    WARN: "warn",
    ERROR: "error",
    DEBUG: "debug", // For detailed debugging during development.
  },

  /**
   * Monitoring interval for periodic health checks (in milliseconds).
   * Used for monitoring system performance and task backlog status.
   */
  MONITORING_INTERVAL: 60000, // 1 minute

  // ===================== Customization Options =====================
  /**
   * Dynamic configuration options for admin-level customization.
   * Exposed through an admin panel for real-time adjustments.
   */
  ENABLE_DYNAMIC_CONFIGURATION: true,
  CONFIGURABLE_PARAMETERS: [
    "PROXIMITY_RADIUS",
    "MIN_MATCH_SCORE",
    "TOP_CANDIDATES_LIMIT",
    "REASSIGNMENT_RETRY_LIMIT",
    "MAX_WORKLOAD_THRESHOLD",
    "DEFAULT_HOURLY_RATE_THRESHOLD",
  ],
};
