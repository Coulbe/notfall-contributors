/**
 * routes/githubAuthRoutes.js
 * Handles GitHub authentication and linking routes.
 */

const express = require("express");
const githubAuthController = require("../controllers/githubAuthController");

const router = express.Router();

router.get("/auth", githubAuthController.initiateOAuth);
router.get("/callback", githubAuthController.handleOAuthCallback);

module.exports = router;
