/**
 * services/githubContributorService.js
 * This service handles advanced contributor management with GitHub integration for the Notfall system.
 * Features:
 * - Role-based and task-based folder access control.
 * - GitHub collaborator invitations.
 * - Issue linking to system tasks.
 * - Fetching contributors with roles and permissions.
 * - Enhanced logging and error handling for secure repository management.
 */

const { Octokit } = require("@octokit/rest");
const logger = require("../utils/logger");
const Task = require("../models/Task");

// Load GitHub configurations from environment variables
const GITHUB_ACCESS_TOKEN = process.env.GITHUB_ACCESS_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER || "Coulbe";
const GITHUB_REPO = process.env.GITHUB_REPO || "notfall-contributors";

// Initialize Octokit for GitHub API interactions
const octokit = new Octokit({
  auth: GITHUB_ACCESS_TOKEN,
});

/**
 * Invite a contributor to the GitHub repository.
 * @param {String} username - GitHub username of the contributor.
 * @param {String} permission - Permission level (default: `push`).
 * @returns {Object} - Response data from GitHub API.
 */
const inviteContributor = async (username, permission = "push") => {
  try {
    logger.info(`Attempting to invite ${username} to the repository with ${permission} permissions.`);
    const response = await octokit.repos.addCollaborator({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      username,
      permission,
    });
    logger.info(`Successfully invited ${username} with ${permission} permissions.`);
    return response.data;
  } catch (error) {
    logger.error(`Failed to invite contributor ${username}: ${error.message}`);
    if (error.status === 404) throw new Error(`GitHub user ${username} not found.`);
    if (error.status === 403) throw new Error("Insufficient permissions to invite contributors.");
    throw new Error("GitHub collaborator invitation failed. Please try again later.");
  }
};

/**
 * Grant folder access to contributors based on their assigned tasks and roles.
 * @param {String} username - GitHub username.
 * @param {String} folderAccess - The folder the contributor needs access to.
 * @param {String} permission - GitHub permission level (default: `push`).
 * @returns {Object} - GitHub API response for collaborator addition.
 */
const grantFolderAccess = async (username, folderAccess, permission = "push") => {
  try {
    logger.info(`Granting ${username} access to folder: ${folderAccess} with ${permission} permissions.`);
    
    // Verify if the task and folder exist
    const task = await Task.findOne({ assignedToGitHub: username, folderAccess });
    if (!task) throw new Error(`No task assigned to ${username} for folder ${folderAccess}.`);

    const response = await octokit.repos.addCollaborator({
      owner: GITHUB_OWNER,
      repo: `${GITHUB_REPO}/${folderAccess}`,
      username,
      permission,
    });
    logger.info(`Access granted to ${username} for folder: ${folderAccess}.`);
    return response.data;
  } catch (error) {
    logger.error(`Failed to grant folder access to ${username}: ${error.message}`);
    throw new Error("Folder access grant failed.");
  }
};

/**
 * Revoke folder access from contributors when tasks are unassigned or completed.
 * @param {String} username - GitHub username.
 * @param {String} folderAccess - The folder to revoke access from.
 * @returns {Object} - GitHub API response for collaborator removal.
 */
const revokeFolderAccess = async (username, folderAccess) => {
  try {
    logger.info(`Revoking ${username} access to folder: ${folderAccess}.`);
    const response = await octokit.repos.removeCollaborator({
      owner: GITHUB_OWNER,
      repo: `${GITHUB_REPO}/${folderAccess}`,
      username,
    });
    logger.info(`Access revoked from ${username} for folder: ${folderAccess}.`);
    return response.data;
  } catch (error) {
    logger.error(`Failed to revoke folder access for ${username}: ${error.message}`);
    throw new Error("Folder access revoke failed.");
  }
};

/**
 * Link a GitHub issue to a system task.
 * @param {String} issueNumber - The GitHub issue number.
 * @param {String} taskId - The ID of the task in the Notfall system.
 * @returns {Object} - Updated GitHub issue details.
 */
const linkGitHubIssueToTask = async (issueNumber, taskId) => {
  try {
    logger.info(`Linking GitHub issue #${issueNumber} to Task ID: ${taskId}.`);
    const body = `This issue is linked to [Task ID: ${taskId}] in the Notfall system.`;
    const response = await octokit.issues.update({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      issue_number: issueNumber,
      body,
    });
    logger.info(`Successfully linked GitHub issue #${issueNumber} to Task ID: ${taskId}.`);
    return response.data;
  } catch (error) {
    logger.error(`Failed to link GitHub issue #${issueNumber} to Task ID ${taskId}: ${error.message}`);
    throw new Error("Error linking GitHub issue to task. Please try again later.");
  }
};

/**
 * Fetch all contributors with their roles and permissions.
 * @returns {Array} - List of contributors with access details.
 */
const fetchContributors = async () => {
  try {
    logger.info("Fetching contributors from the repository.");
    const response = await octokit.repos.listCollaborators({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
    });
    logger.info("Contributors fetched successfully.");
    return response.data.map((contributor) => ({
      username: contributor.login,
      role: contributor.permissions,
    }));
  } catch (error) {
    logger.error(`Failed to fetch contributors: ${error.message}`);
    throw new Error("Error retrieving contributors list.");
  }
};

/**
 * Remove a contributor from the repository.
 * @param {String} username - GitHub username.
 * @returns {String} - Confirmation message.
 */
const removeContributor = async (username) => {
  try {
    logger.info(`Removing contributor ${username} from the repository.`);
    await octokit.repos.removeCollaborator({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      username,
    });
    logger.info(`Contributor ${username} removed successfully.`);
    return `Contributor ${username} has been removed.`;
  } catch (error) {
    logger.error(`Failed to remove contributor ${username}: ${error.message}`);
    throw new Error("Error removing contributor.");
  }
};

module.exports = {
  inviteContributor,
  grantFolderAccess,
  revokeFolderAccess,
  linkGitHubIssueToTask,
  fetchContributors,
  removeContributor,
};
