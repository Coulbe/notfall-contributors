const express = require("express");
const {
  getTaskFolder,
  getFolderAccessLogs,
  revokeFolderAccess,
  assignFolderAccess,
  checkFolderAccess,
  previewFolderContents,
  scheduleFolderAccessRevocation,
  createFolder,
  getContributorFolders,
  getFolderDetails,
  updateFolder,
  deleteFolder,
  assignTaskToFolder,
  organizeTasksInFolder,
  batchAssignFolderAccess,
} = require("../controllers/folderController");
const { verifyToken } = require("../middleware/authMiddleware");
const {
  validateRole,
  checkPermissions,
  logAccessAttempt,
  validateBatchOperations,
} = require("../middleware/roleMiddleware");
const { logDataModification } = require("../middleware/auditMiddleware");

const router = express.Router();

/**
 * Folder Management Routes
 */

// Create a new folder
router.post(
  "/",
  verifyToken,
  validateRole(["Admin", "ProjectManager"]),
  logDataModification("folders", "CREATE"),
  createFolder
);

// Get all folders for a contributor
router.get(
  "/:contributorId",
  verifyToken,
  checkPermissions("viewFolders"),
  logAccessAttempt("folders"),
  getContributorFolders
);

// Get detailed folder information, including tasks and nested folders
router.get(
  "/:folderId/details",
  verifyToken,
  checkPermissions("viewFolders"),
  logAccessAttempt("folders"),
  getFolderDetails
);

// Update folder details (e.g., rename)
router.put(
  "/:folderId",
  verifyToken,
  validateRole(["Admin", "ProjectManager"]),
  logDataModification("folders", "UPDATE"),
  updateFolder
);

// Delete a folder and optionally its contents
router.delete(
  "/:folderId",
  verifyToken,
  validateRole(["Admin"]),
  logDataModification("folders", "DELETE"),
  deleteFolder
);

// Organize tasks in a folder (e.g., by priority, status, etc.)
router.get(
  "/:folderId/organize-tasks",
  verifyToken,
  checkPermissions("manageFolders"),
  logAccessAttempt("folders"),
  organizeTasksInFolder
);

/**
 * Folder-Task Assignment Routes
 */

// Assign a single task to a folder
router.post(
  "/assign-task",
  verifyToken,
  validateRole(["Admin", "ProjectManager"]),
  logDataModification("folders", "ASSIGN_TASK"),
  assignTaskToFolder
);

/**
 * Folder Access Control Routes
 */

// Get folder path for a task
router.get(
  "/:taskId",
  verifyToken,
  logAccessAttempt("folders"),
  checkPermissions("assignedFolders"),
  getTaskFolder
);

// Fetch folder access logs
router.get(
  "/logs",
  verifyToken,
  validateRole(["Admin"]),
  logAccessAttempt("logs"),
  getFolderAccessLogs
);

// Revoke folder access
router.post(
  "/:taskId/revoke",
  verifyToken,
  validateRole(["Admin"]),
  logDataModification("folders", "REVOKE_ACCESS"),
  revokeFolderAccess
);

// Assign folder access to a contributor
router.post(
  "/:taskId/assign",
  verifyToken,
  validateRole(["Admin", "ProjectManager"]),
  logDataModification("folders", "ASSIGN_ACCESS"),
  assignFolderAccess
);

// Batch assign folder access to multiple contributors
router.post(
  "/batch-assign",
  verifyToken,
  validateRole(["Admin"]),
  validateBatchOperations("folders", "ASSIGN_ACCESS"),
  logDataModification("folders", "BATCH_ASSIGN_ACCESS"),
  batchAssignFolderAccess
);

// Check if a contributor has access to a folder
router.get(
  "/:taskId/check",
  verifyToken,
  logAccessAttempt("folders"),
  checkFolderAccess
);

// Preview folder contents
router.get(
  "/:taskId/preview",
  verifyToken,
  logAccessAttempt("folders"),
  previewFolderContents
);

// Schedule folder access revocation
router.post(
  "/:taskId/schedule-revocation",
  verifyToken,
  validateRole(["Admin"]),
  logDataModification("folders", "SCHEDULE_REVOCATION"),
  scheduleFolderAccessRevocation
);

module.exports = router;

