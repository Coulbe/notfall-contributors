import api from "./api";

/**
 * Fetch all folders for a specific contributor.
 * @param {String} contributorId - The ID of the contributor.
 * @returns {Array} - List of folders associated with the contributor.
 */
export const fetchContributorFolders = async (contributorId) => {
  const response = await api.get(`/folders/${contributorId}`);
  return response.data;
};

/**
 * Create a new folder.
 * @param {Object} folderData - Data for the new folder.
 * @returns {Object} - The newly created folder.
 */
export const createFolder = async (folderData) => {
  const response = await api.post("/folders", folderData);
  return response.data;
};

/**
 * Assign a task to a specific folder.
 * @param {String} taskId - The ID of the task.
 * @param {String} folderId - The ID of the folder.
 * @returns {Object} - Updated folder with the assigned task.
 */
export const assignTaskToFolder = async (taskId, folderId) => {
  const response = await api.post(`/folders/assign-task`, { taskId, folderId });
  return response.data;
};

/**
 * Batch assign folders to multiple contributors.
 * @param {Array} assignmentData - Array of objects with folder and contributor mapping.
 * @returns {Object} - Status of the batch assignment.
 */
export const batchAssignFolders = async (assignmentData) => {
  const response = await api.post("/folders/batch-assign", assignmentData);
  return response.data;
};

/**
 * Schedule folder access revocation.
 * @param {String} folderId - The ID of the folder.
 * @param {String} date - Date when access should be revoked.
 * @returns {Object} - Confirmation of scheduled revocation.
 */
export const scheduleFolderAccessRevocation = async (folderId, date) => {
  const response = await api.post(`/folders/${folderId}/schedule-revocation`, { date });
  return response.data;
};

/**
 * Preview the contents of a folder.
 * @param {String} folderId - The ID of the folder.
 * @returns {Object} - Details and contents of the folder.
 */
export const previewFolderContents = async (folderId) => {
  const response = await api.get(`/folders/${folderId}/preview`);
  return response.data;
};

/**
 * Revoke access to a folder for a contributor.
 * @param {String} folderId - The ID of the folder.
 * @param {String} contributorId - The ID of the contributor.
 * @returns {Object} - Confirmation of access revocation.
 */
export const revokeFolderAccess = async (folderId, contributorId) => {
  const response = await api.post(`/folders/${folderId}/revoke`, { contributorId });
  return response.data;
};

/**
 * Delete a specific folder.
 * @param {String} folderId - The ID of the folder to delete.
 * @returns {Object} - Confirmation of deletion.
 */
export const deleteFolder = async (folderId) => {
  const response = await api.delete(`/folders/${folderId}`);
  return response.data;
};
