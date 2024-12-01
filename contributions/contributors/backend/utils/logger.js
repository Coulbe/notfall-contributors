const { createLogger, format, transports } = require("winston");

// Define log format
const logFormat = format.printf(({ timestamp, level, message, stack }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
});

// Create a Winston logger instance
const logger = createLogger({
  level: process.env.LOG_LEVEL || "info", // Default level: info
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    format.splat(),
    logFormat
  ),
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), logFormat),
    }),
    new transports.File({ filename: "logs/combined.log" }),
    new transports.File({ filename: "logs/error.log", level: "error" }),
  ],
});

logger.debugLog = (message) => {
  if (process.env.NODE_ENV !== "production") {
    logger.debug(message);
  }
};

// Add a stream method for integration with Morgan
logger.stream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

module.exports = logger;
