/**
 * controllers/githubAuthController.js
 * Handles GitHub OAuth authentication and contributor onboarding.
 */

const githubAuthService = require("../services/githubAuthService");
const User = require("../models/User");
const logger = require("../utils/logger");

/**
 * GitHub OAuth callback to exchange code for token and onboard users.
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 */
const githubOAuthCallback = async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ message: "GitHub OAuth code is required." });
    }

    const token = await githubAuthService.getGitHubAccessToken(code);
    const profile = await githubAuthService.getGitHubUserProfile(token);

    let user = await User.findOne({ githubId: profile.id });

    if (!user) {
      user = new User({
        githubId: profile.id,
        name: profile.name || profile.login,
        email: profile.email || `${profile.login}@github.com`,
        githubUsername: profile.login,
      });
      await user.save();
    }

    logger.info(`GitHub user authenticated: ${profile.login}`);
    res.status(200).json({ message: "GitHub authentication successful.", user });
  } catch (error) {
    logger.error(`GitHub OAuth callback failed: ${error.message}`);
    res.status(500).json({ message: "GitHub authentication failed." });
  }
};

module.exports = {
  githubOAuthCallback,
};
