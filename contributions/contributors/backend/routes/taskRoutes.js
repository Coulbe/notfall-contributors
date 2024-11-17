const express = require('express');
const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  assignTaskToContributor,
  getMyTasks,
} = require('../controllers/taskController');
const { verifyToken } = require('../middleware/authMiddleware');
const { validateRole, checkPermissions, logAccessAttempt } = require('../middleware/roleMiddleware');
const { logDataModification } = require('../middleware/auditMiddleware');

const router = express.Router();

/**
 * @route   GET /tasks
 * @desc    Fetch all tasks (Admin, ProjectManager)
 * @access  Protected
 */
router.get(
  '/',
  verifyToken,
  validateRole(['Admin', 'ProjectManager']),
  logAccessAttempt('tasks'),
  getAllTasks
);

/**
 * @route   GET /tasks/:taskId
 * @desc    Fetch task by ID (Self, Admin, ProjectManager)
 * @access  Protected
 */
router.get(
  '/:taskId',
  verifyToken,
  checkPermissions('tasks'),
  logAccessAttempt('tasks'),
  getTaskById
);

/**
 * @route   POST /tasks
 * @desc    Create a new task (Admin, ProjectManager)
 * @access  Protected
 */
router.post(
  '/',
  verifyToken,
  validateRole(['Admin', 'ProjectManager']),
  logDataModification('tasks', 'CREATE'),
  createTask
);

/**
 * @route   PUT /tasks/:taskId
 * @desc    Update task details (Admin, ProjectManager)
 * @access  Protected
 */
router.put(
  '/:taskId',
  verifyToken,
  validateRole(['Admin', 'ProjectManager']),
  logDataModification('tasks', 'UPDATE'),
  updateTask
);

/**
 * @route   PATCH /tasks/:taskId/status
 * @desc    Update task status (Self, Admin, ProjectManager)
 * @access  Protected
 */
router.patch(
  '/:taskId/status',
  verifyToken,
  checkPermissions('tasks'),
  logDataModification('tasks', 'UPDATE_STATUS'),
  updateTaskStatus
);

/**
 * @route   DELETE /tasks/:taskId
 * @desc    Delete a task (Admin)
 * @access  Protected
 */
router.delete(
  '/:taskId',
  verifyToken,
  validateRole(['Admin']),
  logDataModification('tasks', 'DELETE'),
  deleteTask
);

/**
 * @route   POST /tasks/:taskId/assign
 * @desc    Assign a task to a contributor (Admin, ProjectManager)
 * @access  Protected
 */
router.post(
  '/:taskId/assign',
  verifyToken,
  validateRole(['Admin', 'ProjectManager']),
  logDataModification('tasks', 'ASSIGN'),
  assignTaskToContributor
);

/**
 * @route   GET /tasks/my-tasks
 * @desc    Fetch tasks assigned to the logged-in contributor (Contributor)
 * @access  Protected
 */
router.get(
  '/my-tasks',
  verifyToken,
  validateRole(['Contributor']),
  logAccessAttempt('my-tasks'),
  getMyTasks
);

module.exports = router;
