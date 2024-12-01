/**
 * services/githubIssueService.js
 * This service manages GitHub issue interactions while integrating with the Notfall system users and tasks.
 * Features include creating, assigning, commenting, fetching, and closing GitHub issues with linked rewards.
 */

const { Octokit } = require("@octokit/rest");
const logger = require("../utils/logger");
const User = require("../models/User");
const Task = require("../models/Task");
const GitHubIssue = require("../models/GitHubIssue");
const NotcoinService = require("./blockchain/notcoinService");

// GitHub API Configuration
const GITHUB_ACCESS_TOKEN = process.env.GITHUB_ACCESS_TOKEN; // GitHub API Token
const GITHUB_OWNER = process.env.GITHUB_OWNER || "Coulbe"; // Repository Owner
const GITHUB_REPO = process.env.GITHUB_REPO || "notfall-contributors"; // Repository Name

// Initialize Octokit instance
const octokit = new Octokit({
  auth: GITHUB_ACCESS_TOKEN,
});

/**
 * Create a new GitHub issue and link it to a Notfall task and user.
 * @param {Object} issueDetails - Details for the GitHub issue.
 * @param {String} userId - ID of the Notfall user initiating the issue.
 * @returns {Object} - GitHub issue details and database record.
 */
const createIssue = async (issueDetails, userId) => {
  try {
    // Validate user and task existence
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found.");

    const task = issueDetails.linkedTask ? await Task.findById(issueDetails.linkedTask) : null;
    if (issueDetails.linkedTask && !task) throw new Error("Task not found.");

    // Create GitHub issue
    const response = await octokit.issues.create({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      title: issueDetails.title,
      body: `${issueDetails.body}\n\n**Reported by:** ${user.name} (${user.email})`,
      labels: issueDetails.labels || [],
    });

    // Store issue in database
    const newIssue = await GitHubIssue.create({
      issueNumber: response.data.number,
      title: issueDetails.title,
      description: issueDetails.body,
      labels: issueDetails.labels,
      linkedTask: task ? task._id : null,
      status: "Open",
      createdBy: user._id,
    });

    logger.info(`GitHub issue #${response.data.number} created and linked to user: ${userId}`);
    return { issue: response.data, local: newIssue };
  } catch (error) {
    logger.error(`Error creating GitHub issue: ${error.message}`);
    throw new Error("Failed to create GitHub issue.");
  }
};

/**
 * Assign a GitHub issue to a Notfall user.
 * @param {Number} issueNumber - GitHub issue number.
 * @param {String} userId - ID of the Notfall user.
 * @returns {Object} - Updated GitHub issue data.
 */
const assignIssue = async (issueNumber, userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found.");

    const response = await octokit.issues.addAssignees({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      issue_number: issueNumber,
      assignees: [user.githubUsername],
    });

    logger.info(`GitHub issue #${issueNumber} assigned to user: ${userId}`);
    return response.data;
  } catch (error) {
    logger.error(`Error assigning GitHub issue: ${error.message}`);
    throw new Error("Failed to assign GitHub issue.");
  }
};

/**
 * Add a comment to a GitHub issue.
 * @param {Number} issueNumber - GitHub issue number.
 * @param {String} comment - The comment text.
 * @param {String} userId - ID of the Notfall user adding the comment.
 * @returns {Object} - GitHub comment response.
 */
const addComment = async (issueNumber, comment, userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found.");

    const response = await octokit.issues.createComment({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      issue_number: issueNumber,
      body: `${comment}\n\n**Commented by:** ${user.name} (${user.email})`,
    });

    logger.info(`Comment added to GitHub issue #${issueNumber} by user: ${userId}`);
    return response.data;
  } catch (error) {
    logger.error(`Error adding comment to GitHub issue: ${error.message}`);
    throw new Error("Failed to add comment to GitHub issue.");
  }
};

/**
 * Fetch all open GitHub issues linked to Notfall tasks and contributors.
 * @returns {Array} - List of open issues with detailed Notfall data.
 */
const getOpenIssues = async () => {
  try {
    const issues = await GitHubIssue.find({ status: "Open" })
      .populate("linkedTask")
      .populate("createdBy", "name email githubUsername");

    logger.info("Fetched open GitHub issues with enriched Notfall data.");
    return issues;
  } catch (error) {
    logger.error(`Error fetching open GitHub issues: ${error.message}`);
    throw new Error("Failed to fetch open GitHub issues.");
  }
};

/**
 * Close a GitHub issue and distribute rewards to the contributor.
 * @param {Number} issueNumber - GitHub issue number.
 * @param {String} userId - ID of the user closing the issue.
 * @returns {Object} - Updated issue and reward details.
 */
const closeIssueAndReward = async (issueNumber, userId) => {
  try {
    const issue = await GitHubIssue.findOne({ issueNumber });
    if (!issue) throw new Error("GitHub issue not found.");

    await octokit.issues.update({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      issue_number: issueNumber,
      state: "closed",
    });

    issue.status = "Closed";
    await issue.save();

    const reward = await NotcoinService.mintReward(userId, issue.linkedTask);
    logger.info(`GitHub issue #${issueNumber} closed and reward distributed to user: ${userId}`);
    return { issue, reward };
  } catch (error) {
    logger.error(`Error closing GitHub issue and distributing rewards: ${error.message}`);
    throw new Error("Failed to close issue and distribute rewards.");
  }
};

/**
 * Sync GitHub issues with the local database for consistency.
 * @returns {Object} - Sync results with added or updated issues.
 */
const syncIssues = async () => {
  try {
    const response = await octokit.issues.listForRepo({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      state: "all",
    });

    const issues = response.data;

    for (const issue of issues) {
      const existing = await GitHubIssue.findOne({ issueNumber: issue.number });
      if (existing) {
        existing.status = issue.state === "open" ? "Open" : "Closed";
        await existing.save();
      } else {
        await GitHubIssue.create({
          issueNumber: issue.number,
          title: issue.title,
          description: issue.body,
          status: issue.state === "open" ? "Open" : "Closed",
          labels: issue.labels.map((label) => label.name),
        });
      }
    }

    logger.info("GitHub issues synced with local database.");
    return { synced: issues.length };
  } catch (error) {
    logger.error(`Error syncing GitHub issues: ${error.message}`);
    throw new Error("Failed to sync GitHub issues.");
  }
};

module.exports = {
  createIssue,
  assignIssue,
  addComment,
  getOpenIssues,
  closeIssueAndReward,
  syncIssues,
};
