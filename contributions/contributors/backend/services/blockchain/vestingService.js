const moment = require("moment");
const logger = require("../utils/logger");

/**
 * Vesting Schedule
 * Each entry defines the percentage of tokens unlocked at a specific timestamp.
 * Example: { timestamp: 1672531200, percentage: 25 } unlocks 25% of the tokens at the given time.
 */
const vestingSchedules = new Map();

/**
 * Adds a new vesting schedule for a beneficiary.
 * @param {string} beneficiary - The wallet address of the beneficiary.
 * @param {number} totalTokens - Total tokens allocated.
 * @param {Array<Object>} schedule - Array of { timestamp, percentage } objects.
 */
const addVestingSchedule = (beneficiary, totalTokens, schedule) => {
  if (!beneficiary || totalTokens <= 0 || !Array.isArray(schedule)) {
    throw new Error("Invalid vesting schedule parameters.");
  }

  vestingSchedules.set(beneficiary, {
    totalTokens,
    schedule: schedule.sort((a, b) => a.timestamp - b.timestamp), // Sort by timestamp
    claimed: 0,
  });

  logger.info(`Vesting schedule added for ${beneficiary}`);
};

/**
 * Calculates the total unlocked tokens for a beneficiary.
 * @param {string} beneficiary - The wallet address of the beneficiary.
 * @returns {number} - Total unlocked tokens.
 */
const calculateUnlockedTokens = (beneficiary) => {
  const vesting = vestingSchedules.get(beneficiary);

  if (!vesting) {
    throw new Error("No vesting schedule found for the given beneficiary.");
  }

  const currentTime = moment().unix();
  let unlockedPercentage = 0;

  vesting.schedule.forEach(({ timestamp, percentage }) => {
    if (currentTime >= timestamp) {
      unlockedPercentage += percentage;
    }
  });

  return Math.floor((vesting.totalTokens * unlockedPercentage) / 100);
};

/**
 * Claims available tokens for a beneficiary.
 * @param {string} beneficiary - The wallet address of the beneficiary.
 * @returns {number} - Number of tokens successfully claimed.
 */
const claimTokens = (beneficiary) => {
  const vesting = vestingSchedules.get(beneficiary);

  if (!vesting) {
    throw new Error("No vesting schedule found for the given beneficiary.");
  }

  const unlockedTokens = calculateUnlockedTokens(beneficiary);
  const claimableTokens = unlockedTokens - vesting.claimed;

  if (claimableTokens <= 0) {
    throw new Error("No claimable tokens available.");
  }

  vesting.claimed += claimableTokens;
  logger.info(`${claimableTokens} tokens claimed by ${beneficiary}`);

  return claimableTokens;
};

/**
 * Fetches the current vesting status of a beneficiary.
 * @param {string} beneficiary - The wallet address of the beneficiary.
 * @returns {Object} - Vesting status, including total, claimed, and unlocked tokens.
 */
const getVestingStatus = (beneficiary) => {
  const vesting = vestingSchedules.get(beneficiary);

  if (!vesting) {
    throw new Error("No vesting schedule found for the given beneficiary.");
  }

  const unlockedTokens = calculateUnlockedTokens(beneficiary);

  return {
    totalTokens: vesting.totalTokens,
    claimedTokens: vesting.claimed,
    unlockedTokens,
    remainingTokens: unlockedTokens - vesting.claimed,
  };
};

module.exports = {
  addVestingSchedule,
  calculateUnlockedTokens,
  claimTokens,
  getVestingStatus,
};
