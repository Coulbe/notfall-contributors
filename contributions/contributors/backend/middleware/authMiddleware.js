const jwt = require("jsonwebtoken");
const Contributor = require("../models/Contributor");
const logger = require("../utils/logger"); // Logging utility

/**
 * Middleware to verify JWT token and attach user to request.
 */
exports.verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header

  if (!token) {
    logger.warn("Unauthorized access attempt: No token provided");
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    req.user = await Contributor.findById(decoded.id).select("-password"); // Attach user to request

    if (!req.user) {
      logger.warn(`Access denied: User not found (ID: ${decoded.id})`);
      return res.status(404).json({ message: "User not found" });
    }

    logger.info(`Token verified successfully for user: ${req.user.username}`);
    next();
  } catch (error) {
    logger.error(`Invalid or expired token: ${error.message}`);
    res.status(401).json({ message: "Invalid or expired token", error: error.message });
  }
};

/**
 * Middleware for optional authentication (attach user if token exists).
 */
exports.optionalAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    req.user = null; // Proceed without user context
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await Contributor.findById(decoded.id).select("-password");
    logger.info(`Optional authentication: User attached - ${req.user.username}`);
  } catch (error) {
    req.user = null; // Invalid token, proceed without user context
    logger.warn("Optional authentication: Invalid token provided");
  }

  next();
};

/**
 * Middleware to check user activity status.
 */
exports.checkActiveStatus = async (req, res, next) => {
  try {
    const contributor = await Contributor.findById(req.user.id);

    if (!contributor) {
      logger.warn(`Access denied: User not found (ID: ${req.user.id})`);
      return res.status(404).json({ message: "User not found" });
    }

    if (contributor.status !== "Active") {
      logger.warn(`Access denied: Inactive user (ID: ${req.user.id}, Status: ${contributor.status})`);
      return res.status(403).json({ message: "User is not active" });
    }

    logger.info(`Active status verified for user: ${req.user.username}`);
    next();
  } catch (error) {
    logger.error(`Error checking active status: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Middleware to validate roles for specific routes.
 */
exports.validateRole = (allowedRoles) => (req, res, next) => {
  const { role } = req.user;

  if (!allowedRoles.includes(role)) {
    logger.warn(`Access denied for user: ${req.user.username}, Role: ${role}, Allowed: ${allowedRoles}`);
    return res.status(403).json({ message: `Access denied: Role '${role}' is not permitted` });
  }

  logger.info(`Role validation passed for user: ${req.user.username}, Role: ${role}`);
  next();
};

/**
 * Middleware to refresh tokens.
 */
exports.refreshToken = async (req, res) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    logger.warn("Token refresh attempt failed: No token provided");
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const newToken = jwt.sign(
      {
        id: decoded.id,
        username: decoded.username,
        role: decoded.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    logger.info(`Token refreshed successfully for user: ${decoded.username}`);
    res.status(200).json({ token: newToken });
  } catch (error) {
    logger.error(`Token refresh failed: ${error.message}`);
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

/**
 * Middleware to handle multi-factor authentication (MFA) check.
 */
exports.checkMFA = async (req, res, next) => {
  try {
    const contributor = await Contributor.findById(req.user.id);

    if (!contributor) {
      logger.warn(`MFA check failed: User not found (ID: ${req.user.id})`);
      return res.status(404).json({ message: "User not found" });
    }

    if (!contributor.mfaEnabled || contributor.mfaVerified) {
      logger.info(`MFA check passed for user: ${req.user.username}`);
      return next();
    }

    logger.warn(`MFA verification required for user: ${req.user.username}`);
    return res.status(403).json({ message: "Multi-factor authentication required" });
  } catch (error) {
    logger.error(`Error during MFA check: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Middleware to log out the user (example with token blacklisting).
 */
exports.logoutUser = (req, res) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    logger.warn("Logout attempt failed: No token provided");
    return res.status(400).json({ message: "No token provided for logout" });
  }

  try {
    // Example: Add the token to a blacklist (database or cache)
    logger.info(`User logged out successfully: ${req.user.username}`);
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    logger.error(`Logout failed: ${error.message}`);
    res.status(500).json({ message: "Error during logout" });
  }
};
