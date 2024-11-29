/**
 * services/githubService.js
 * Handles GitHub REST API interactions, including issue management, pull request handling, and contributor management.
 */

const { Octokit } = require("@octokit/rest");
const logger = require("../utils/logger");

const GITHUB_ACCESS_TOKEN = process.env.GITHUB_ACCESS_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER || "Coulbe";
const GITHUB_REPO = process.env.GITHUB_REPO || "notfall-contributors";

const octokit = new Octokit({
  auth: GITHUB_ACCESS_TOKEN,
});

/* ------------------------------------
   Issue Management
------------------------------------ */

/**
 * Create a new issue on GitHub.
 * @param {Object} issueData - Issue details.
 * @returns {Object} - Created issue response.
 */
const createIssue = async (issueData) => {
  try {
    const response = await octokit.issues.create({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      title: issueData.title,
      body: issueData.body,
      labels: issueData.labels || [],
    });
    logger.info(`GitHub Issue created: ${response.data.html_url}`);
    return response.data;
  } catch (error) {
    logger.error(`Error creating GitHub issue: ${error.message}`);
    throw error;
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

/* ------------------------------------
   Pull Request Management
------------------------------------ */

/**
 * Fetch open pull requests from GitHub.
 * @returns {Array} - List of pull requests.
 */
const getPullRequests = async () => {
  try {
    const response = await octokit.pulls.list({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      state: "open",
    });
    return response.data;
  } catch (error) {
    logger.error(`Error fetching GitHub pull requests: ${error.message}`);
    throw error;
  }
};

/**
 * Comment on a pull request.
 * @param {Number} pullNumber - Pull request number.
 * @param {String} comment - Comment to post.
 */
const commentOnPullRequest = async (pullNumber, comment) => {
  try {
    const response = await octokit.issues.createComment({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      issue_number: pullNumber,
      body: comment,
    });
    logger.info(`Comment added to PR #${pullNumber}: ${comment}`);
    return response.data;
  } catch (error) {
    logger.error(`Error commenting on PR: ${error.message}`);
    throw error;
  }
};

/* ------------------------------------
   Contributor Management
------------------------------------ */

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

/* ------------------------------------
   Module Exports
------------------------------------ */
module.exports = {
  createIssue,
  linkGitHubIssueToTask,
  getPullRequests,
  commentOnPullRequest,
  inviteContributor,
};
