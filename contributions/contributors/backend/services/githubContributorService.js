/**
 * services/githubContributorService.js
 * Handles advanced contributor management with GitHub integration, including collaboration, issue linking, and PR management.
 */

const { Octokit } = require("@octokit/rest");
const logger = require("../utils/logger");

const GITHUB_ACCESS_TOKEN = process.env.GITHUB_ACCESS_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER || "Coulbe";
const GITHUB_REPO = process.env.GITHUB_REPO || "notfall-contributors";

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
    const response = await octokit.repos.addCollaborator({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      username,
      permission,
    });
    logger.info(`Collaborator invitation sent to ${username}.`);
    return response.data;
  } catch (error) {
    logger.error(`Failed to invite contributor ${username}: ${error.message}`);
    throw new Error("GitHub collaborator invitation failed.");
  }
};

/**
 * Link a GitHub issue to a task in the Notfall system.
 * @param {String} issueNumber - GitHub issue number.
 * @param {String} taskId - Task ID in the Notfall system.
 * @returns {Object} - Updated issue details.
 */
const linkGitHubIssueToTask = async (issueNumber, taskId) => {
  try {
    const body = `This issue is linked to [Task ID: ${taskId}].`;
    const response = await octokit.issues.update({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      issue_number: issueNumber,
      body,
    });
    logger.info(`GitHub issue #${issueNumber} linked to Task ID: ${taskId}.`);
    return response.data;
  } catch (error) {
    logger.error(`Failed to link issue #${issueNumber} to task: ${error.message}`);
    throw new Error("Error while linking GitHub issue to task.");
  }
};

module.exports = { inviteContributor, linkGitHubIssueToTask };
