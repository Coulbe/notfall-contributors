/**
 * routes/githubAuthRoutes.js
 * Manages GitHub OAuth authentication and contributor linking routes for the Notfall system.
 */

const express = require("express");
const githubAuthController = require("../controllers/githubAuthController");

const router = express.Router();

/**
 * @route GET /auth/github
 * @desc Initiate GitHub OAuth process
 * @access Public
 */
router.get("/auth", githubAuthController.initiateOAuth);

/**
 * @route GET /auth/github/callback
 * @desc Handle GitHub OAuth callback after user authentication
 * @access Public
 */
router.get("/callback", githubAuthController.handleOAuthCallback);

/**
 * @route POST /auth/github/link
 * @desc Link an authenticated GitHub account to a Notfall system user account
 * @access Private
 */
router.post("/link", githubAuthController.linkGitHubAccount);

module.exports = router;
