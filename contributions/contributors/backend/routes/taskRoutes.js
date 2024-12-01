const express = require("express");
const {
  getAllContributors,
  getContributorById,
  createContributor,
  updateContributor,
  updateContributorRole,
  assignTaskToContributor,
  logActivity,
  deleteContributor,
  getContributorTasks,
  addContributor,
} = require("../controllers/contributorController");
const { verifyToken } = require("../middleware/authMiddleware");
const { validateRole, logAccessAttempt } = require("../middleware/roleMiddleware");
const { logDataModification, logFailedAction } = require("../middleware/auditMiddleware");

const router = express.Router();

/**
 * Contributor Routes
 * Handles CRUD operations, role management, task assignment, and activity logging
 * for contributors in the Notfall system.
 */

/**
 * @route   GET /contributors
 * @desc    Fetch all contributors
 * @access  Protected (Admin, ProjectManager)
 */
router.get(
  "/",
  verifyToken,
  validateRole(["Admin", "ProjectManager"]),
  logAccessAttempt("contributors"),
  getAllContributors
);

/**
 * @route   GET /contributors/:contributorId
 * @desc    Fetch a specific contributor by ID
 * @access  Protected (Self, Admin, ProjectManager)
 */
router.get(
  "/:contributorId",
  verifyToken,
  logAccessAttempt("contributors"),
  getContributorById
);

/**
 * @route   POST /contributors
 * @desc    Create a new contributor
 * @access  Protected (Admin)
 */
router.post(
  "/",
  verifyToken,
  validateRole(["Admin"]),
  logDataModification("contributors", "CREATE"),
  createContributor
);

/**
 * @route   POST /contributors/add
 * @desc    Add a contributor (Simplified endpoint for internal use)
 * @access  Protected
 */
router.post("/add", verifyToken, addContributor);

/**
 * @route   PUT /contributors/:contributorId
 * @desc    Update contributor details
 * @access  Protected (Admin)
 */
router.put(
  "/:contributorId",
  verifyToken,
  validateRole(["Admin"]),
  logDataModification("contributors", "UPDATE"),
  updateContributor
);

/**
 * @route   PATCH /contributors/:contributorId/role
 * @desc    Update contributor role
 * @access  Protected (Admin)
 */
router.patch(
  "/:contributorId/role",
  verifyToken,
  validateRole(["Admin"]),
  logDataModification("contributors", "UPDATE_ROLE"),
  updateContributorRole
);

/**
 * @route   POST /contributors/:contributorId/tasks
 * @desc    Assign a task to a contributor
 * @access  Protected (Admin, ProjectManager)
 */
router.post(
  "/:contributorId/tasks",
  verifyToken,
  validateRole(["Admin", "ProjectManager"]),
  logDataModification("tasks", "ASSIGN"),
  assignTaskToContributor
);

/**
 * @route   GET /contributors/:contributorId/tasks
 * @desc    Fetch tasks assigned to a specific contributor
 * @access  Protected (Admin, ProjectManager)
 */
router.get(
  "/:contributorId/tasks",
  verifyToken,
  validateRole(["Admin", "ProjectManager"]),
  logAccessAttempt("tasks"),
  getContributorTasks
);

/**
 * @route   POST /contributors/:contributorId/activity
 * @desc    Log activity for a specific contributor
 * @access  Protected (Self, Admin, ProjectManager)
 */
router.post(
  "/:contributorId/activity",
  verifyToken,
  logDataModification("activity", "LOG"),
  logActivity
);

/**
 * @route   DELETE /contributors/:contributorId
 * @desc    Delete a contributor
 * @access  Protected (Admin)
 */
router.delete(
  "/:contributorId",
  verifyToken,
  validateRole(["Admin"]),
  logDataModification("contributors", "DELETE"),
  deleteContributor
);

module.exports = router;
