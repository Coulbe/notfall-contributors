const jwt = require("jsonwebtoken");
const logger = require("./logger");

/**
 * Validates a token (general API or Notcoin) using a secret key.
 * @param {string} token - The token to validate.
 * @param {string} secret - The secret key for validation.
 * @param {string} [tokenType="Token"] - Type of token being validated for logging.
 * @returns {Object|null} - Decoded payload if valid; null otherwise.
 */
const validateToken = (token, secret, tokenType = "Token") => {
  try {
    const decoded = jwt.verify(token, secret);
    logger.info(`${tokenType} validated successfully.`);
    return decoded;
  } catch (error) {
    logger.error(`Invalid ${tokenType}:`, error.message);
    return null;
  }
};

/**
 * Middleware to validate general access tokens for protected routes.
 * @param {string} secret - The secret key for validation.
 * @returns {Function} - Middleware function.
 */
const accessTokenValidator = (secret) => {
  return (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const validToken = validateToken(token.replace("Bearer ", ""), secret, "Access Token");
    if (!validToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token.",
      });
    }

    req.user = validToken;
    next();
  };
};

/**
 * Middleware to validate refresh tokens for generating new access tokens.
 * @param {string} secret - The secret key for validation.
 * @returns {Function} - Middleware function.
 */
const refreshTokenValidator = (secret) => {
  return (req, res, next) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token is required.",
      });
    }

    const validToken = validateToken(refreshToken, secret, "Refresh Token");
    if (!validToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token.",
      });
    }

    req.user = validToken;
    next();
  };
};

/**
 * Middleware to validate Notcoin tokens for blockchain-related routes.
 * @param {string} secret - Secret key for validation.
 * @returns {Function} - Middleware function.
 */
const notcoinTokenValidator = (secret) => {
  return (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No Notcoin token provided.",
      });
    }

    const validToken = validateToken(token.replace("Bearer ", ""), secret, "Notcoin Token");
    if (!validToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired Notcoin token.",
      });
    }

    req.user = validToken;
    next();
  };
};

/**
 * Validates a Notcoin wallet balance.
 * @param {Object} wallet - Wallet object containing the balance.
 * @param {number} requiredBalance - Minimum Notcoin balance required.
 * @returns {boolean} - True if balance is sufficient; false otherwise.
 */
const validateNotcoinBalance = (wallet, requiredBalance) => {
  if (wallet.balance >= requiredBalance) {
    logger.info(`Sufficient Notcoin balance: ${wallet.balance}`);
    return true;
  } else {
    logger.warn(`Insufficient Notcoin balance: ${wallet.balance}`);
    return false;
  }
};

/**
 * Middleware to enforce wallet balance checks for Notcoin transactions.
 * @param {number} requiredBalance - Minimum Notcoin balance required.
 * @returns {Function} - Middleware function.
 */
const notcoinBalanceValidator = (requiredBalance) => {
  return (req, res, next) => {
    const wallet = req.body.wallet;
    if (!wallet) {
      return res.status(400).json({
        success: false,
        message: "Wallet details are required for this transaction.",
      });
    }

    if (!validateNotcoinBalance(wallet, requiredBalance)) {
      return res.status(403).json({
        success: false,
        message: `Insufficient Notcoin balance. Minimum required: ${requiredBalance}`,
      });
    }

    next();
  };
};

module.exports = {
  validateToken,
  accessTokenValidator,
  refreshTokenValidator,
  notcoinTokenValidator,
  validateNotcoinBalance,
  notcoinBalanceValidator,
};
