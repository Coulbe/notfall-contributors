const winston = require("winston");

/**
 * Configure Winston Logger
 */
const logger = winston.createLogger({
  level: "error",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({ format: winston.format.simple() }), // Logs to console
    new winston.transports.File({ filename: "logs/error.log" }), // Logs to file
  ],
});

/**
 * Error Classification
 * Differentiates between operational errors (e.g., database issues) and programmer errors (e.g., code bugs).
 */
const isOperationalError = (err) => {
  return !(err instanceof SyntaxError || err instanceof ReferenceError);
};

/**
 * Middleware to handle errors globally.
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500; // Default to 500 for unhandled errors
  const isOperational = isOperationalError(err);

  // Build error response object
  const errorResponse = {
    message: err.message || "An unexpected error occurred",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }), // Include stack trace only in non-production environments
    status: statusCode,
    path: req.originalUrl,
    method: req.method,
    ...(isOperational ? { type: "Operational" } : { type: "Programmatic" }),
  };

  // Log error details
  logger.error({
    message: err.message,
    stack: err.stack,
    statusCode,
    path: req.originalUrl,
    method: req.method,
    isOperational,
  });

  // Send error response to client
  res.status(statusCode).json(errorResponse);

  // External monitoring (e.g., Sentry, Datadog)
  if (process.env.SENTRY_DSN && !isOperational) {
    const Sentry = require("@sentry/node");
    Sentry.captureException(err);
  }

  next(); // Ensure the middleware chain continues if needed
};

/**
 * Middleware to handle 404 Not Found errors.
 */
const notFoundHandler = (req, res, next) => {
  const error = new Error(`Resource not found: ${req.originalUrl}`);
  res.status(404);
  next(error); // Pass error to the next middleware
};

module.exports = { errorHandler, notFoundHandler };
