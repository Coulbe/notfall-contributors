/**
 * services/githubAuthService.js
 * Handles GitHub OAuth authentication, token management, and user profile retrieval.
 */

const { Octokit } = require("@octokit/rest");
const axios = require("axios");

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

/**
 * Get GitHub access token using the OAuth code.
 * @param {String} code - OAuth code from GitHub callback.
 * @returns {String} - GitHub access token.
 */
const getGitHubAccessToken = async (code) => {
  try {
    const response = await axios.post("https://github.com/login/oauth/access_token", {
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code,
    });

    const params = new URLSearchParams(response.data);
    return params.get("access_token");
  } catch (error) {
    throw new Error("Failed to fetch GitHub access token.");
  }
};

/**
 * Retrieve authenticated GitHub user profile.
 * @param {String} token - GitHub access token.
 * @returns {Object} - User profile data.
 */
const getGitHubUserProfile = async (token) => {
  const octokit = new Octokit({ auth: token });
  try {
    const { data } = await octokit.users.getAuthenticated();
    return data;
  } catch (error) {
    throw new Error("Failed to fetch GitHub user profile.");
  }
};

module.exports = {
  getGitHubAccessToken,
  getGitHubUserProfile,
};
