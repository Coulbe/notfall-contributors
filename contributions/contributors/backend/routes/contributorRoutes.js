const express = require('express');
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
} = require('../controllers/contributorController');
const { verifyToken } = require('../middleware/authMiddleware');
const { validateRole, logAccessAttempt } = require('../middleware/roleMiddleware');
const { logDataModification, logFailedAction } = require('../middleware/auditMiddleware');

const router = express.Router();

/**
 * @route   GET /contributors
 * @desc    Fetch all contributors (Admin, ProjectManager)
 * @access  Protected
 */
router.get(
  '/',
  verifyToken,
  validateRole(['Admin', 'ProjectManager']),
  logAccessAttempt('contributors'),
  getAllContributors
);

/**
 * @route   GET /contributors/:contributorId
 * @desc    Fetch contributor by ID (Self, Admin, ProjectManager)
 * @access  Protected
 */
router.get(
  '/:contributorId',
  verifyToken,
  logAccessAttempt('contributors'),
  getContributorById
);

/**
 * @route   POST /contributors
 * @desc    Create a new contributor (Admin)
 * @access  Protected
 */
router.post(
  '/',
  verifyToken,
  validateRole(['Admin']),
  logDataModification('contributors', 'CREATE'),
  createContributor
);

/**
 * @route   PUT /contributors/:contributorId
 * @desc    Update contributor details (Admin)
 * @access  Protected
 */
router.put(
  '/:contributorId',
  verifyToken,
  validateRole(['Admin']),
  logDataModification('contributors', 'UPDATE'),
  updateContributor
);

/**
 * @route   PATCH /contributors/:contributorId/role
 * @desc    Update contributor role (Admin)
 * @access  Protected
 */
router.patch(
  '/:contributorId/role',
  verifyToken,
  validateRole(['Admin']),
  logDataModification('contributors', 'UPDATE_ROLE'),
  updateContributorRole
);

/**
 * @route   POST /contributors/:contributorId/tasks
 * @desc    Assign a task to a contributor (Admin, ProjectManager)
 * @access  Protected
 */
router.post(
  '/:contributorId/tasks',
  verifyToken,
  validateRole(['Admin', 'ProjectManager']),
  logDataModification('tasks', 'ASSIGN'),
  assignTaskToContributor
);

/**
 * @route   GET /contributors/:contributorId/tasks
 * @desc    Fetch tasks assigned to a specific contributor (Admin, ProjectManager)
 * @access  Protected
 */
router.get(
  '/:contributorId/tasks',
  verifyToken,
  validateRole(['Admin', 'ProjectManager']),
  logAccessAttempt('tasks'),
  getContributorTasks
);

/**
 * @route   POST /contributors/:contributorId/activity
 * @desc    Log contributor activity (Self, Admin, ProjectManager)
 * @access  Protected
 */
router.post(
  '/:contributorId/activity',
  verifyToken,
  logDataModification('activity', 'LOG'),
  logActivity
);

/**
 * @route   DELETE /contributors/:contributorId
 * @desc    Delete a contributor (Admin)
 * @access  Protected
 */
router.delete(
  '/:contributorId',
  verifyToken,
  validateRole(['Admin']),
  logDataModification('contributors', 'DELETE'),
  deleteContributor
);

module.exports = router;
