const logger = require("./logger");

/**
 * Error handling middleware for Express.
 * Differentiates between user errors and system errors for better reporting.
 * @param {Error} err - Error object.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  const isOperationalError = status < 500; // Operational (user-facing) errors

  // Log the error
  if (isOperationalError) {
    logger.warn(`${req.method} ${req.url} - ${message}`);
  } else {
    logger.error(`${req.method} ${req.url} - ${message}`, err);
  }

  // Send response
  res.status(status).json({
    success: false,
    message,
    error: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

module.exports = errorHandler;
