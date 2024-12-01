const express = require("express");
const accessTokenValidator = require("../middleware/accessTokenMiddleware");

const router = express.Router();

/**
 * @route   GET /profile
 * @desc    Get user profile
 * @access  Protected
 */
router.get("/profile", accessTokenValidator(), (req, res) => {
  res.status(200).json({
    success: true,
    message: "Access token validated successfully.",
    user: req.user, // User details from the token
  });
});

module.exports = router;
