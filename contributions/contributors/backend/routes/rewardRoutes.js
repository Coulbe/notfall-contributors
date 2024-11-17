const express = require('express');
const {
  getAllRewards,
  getContributorRewards,
  addRewardPoints,
  redeemRewardPoints,
  getRewardSummary,
  getRewardHistory,
  notifyRewardActivity,
} = require('../controllers/rewardController');
const { verifyToken } = require('../middleware/authMiddleware');
const { validateRole, logAccessAttempt } = require('../middleware/roleMiddleware');
const { logDataModification, logFailedAction } = require('../middleware/auditMiddleware');

const router = express.Router();

/**
 * @route   GET /rewards
 * @desc    Fetch all rewards (Admin only)
 * @access  Protected
 */
router.get(
  '/',
  verifyToken,
  validateRole(['Admin']),
  logAccessAttempt('rewards'),
  getAllRewards
);

/**
 * @route   GET /rewards/my-rewards
 * @desc    Fetch rewards for the logged-in contributor
 * @access  Protected
 */
router.get(
  '/my-rewards',
  verifyToken,
  logAccessAttempt('my-rewards'),
  getContributorRewards
);

/**
 * @route   POST /rewards/:contributorId/add
 * @desc    Add reward points to a contributor (Admin only)
 * @access  Protected
 */
router.post(
  '/:contributorId/add',
  verifyToken,
  validateRole(['Admin']),
  logDataModification('rewards', 'ADD_POINTS'),
  addRewardPoints,
  notifyRewardActivity
);

/**
 * @route   POST /rewards/redeem
 * @desc    Redeem reward points (Contributor only)
 * @access  Protected
 */
router.post(
  '/redeem',
  verifyToken,
  validateRole(['Contributor']),
  logDataModification('rewards', 'REDEEM_POINTS'),
  redeemRewardPoints,
  notifyRewardActivity
);

/**
 * @route   GET /rewards/summary
 * @desc    Get reward summary (Admin only)
 * @access  Protected
 */
router.get(
  '/summary',
  verifyToken,
  validateRole(['Admin']),
  logAccessAttempt('reward-summary'),
  getRewardSummary
);

/**
 * @route   GET /rewards/history
 * @desc    Fetch reward history for the logged-in contributor (Contributor)
 * @access  Protected
 */
router.get(
  '/history',
  verifyToken,
  validateRole(['Contributor']),
  logAccessAttempt('reward-history'),
  getRewardHistory
);

module.exports = router;
