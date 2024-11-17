const express = require('express');
const {
  getTaskFolder,
  getFolderAccessLogs,
  revokeFolderAccess,
  assignFolderAccess,
  checkFolderAccess,
  previewFolderContents,
  scheduleFolderAccessRevocation,
} = require('../controllers/folderController');
const { verifyToken } = require('../middleware/authMiddleware');
const { validateRole, checkPermissions, logAccessAttempt } = require('../middleware/roleMiddleware');
const { logDataModification } = require('../middleware/auditMiddleware');

const router = express.Router();

/**
 * @route   GET /folders/:taskId
 * @desc    Get folder path for a task (Contributor, Admin)
 * @access  Protected
 */
router.get(
  '/:taskId',
  verifyToken,
  logAccessAttempt('folders'),
  checkPermissions('assignedFolders'),
  getTaskFolder
);

/**
 * @route   GET /folders/logs
 * @desc    Fetch folder access logs (Admin)
 * @access  Protected
 */
router.get(
  '/logs',
  verifyToken,
  validateRole(['Admin']),
  logAccessAttempt('logs'),
  getFolderAccessLogs
);

/**
 * @route   POST /folders/:taskId/revoke
 * @desc    Revoke folder access (Admin)
 * @access  Protected
 */
router.post(
  '/:taskId/revoke',
  verifyToken,
  validateRole(['Admin']),
  logDataModification('folders', 'REVOKE_ACCESS'),
  revokeFolderAccess
);

/**
 * @route   POST /folders/:taskId/assign
 * @desc    Assign folder access to a contributor (Admin, ProjectManager)
 * @access  Protected
 */
router.post(
  '/:taskId/assign',
  verifyToken,
  validateRole(['Admin', 'ProjectManager']),
  logDataModification('folders', 'ASSIGN_ACCESS'),
  assignFolderAccess
);

/**
 * @route   GET /folders/:taskId/check
 * @desc    Check if a contributor has access to a folder (Contributor, Admin)
 * @access  Protected
 */
router.get('/:taskId/check', verifyToken, logAccessAttempt('folders'), checkFolderAccess);

/**
 * @route   GET /folders/:taskId/preview
 * @desc    Preview folder contents (Contributor, Admin)
 * @access  Protected
 */
router.get('/:taskId/preview', verifyToken, logAccessAttempt('folders'), previewFolderContents);

/**
 * @route   POST /folders/:taskId/schedule-revocation
 * @desc    Schedule folder access revocation (Admin)
 * @access  Protected
 */
router.post(
  '/:taskId/schedule-revocation',
  verifyToken,
  validateRole(['Admin']),
  logDataModification('folders', 'SCHEDULE_REVOCATION'),
  scheduleFolderAccessRevocation
);

module.exports = router;
