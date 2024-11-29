/**
 * services/realTimeNotification.js
 * Provides real-time notification services using WebSocket for contributors, engineers, and admins.
 */

const WebSocket = require("ws"); // WebSocket library for real-time communication
const logger = require("../utils/logger"); // Custom logger for tracking events and errors

let wss; // WebSocket server instance
const clients = new Map(); // Map to store connected clients by user ID

/**
 * Initialize WebSocket server.
 * @param {Object} server - HTTP server to attach the WebSocket server.
 */
function initializeWebSocket(server) {
  wss = new WebSocket.Server({ server });

  // Handle new client connections
  wss.on("connection", (ws, req) => {
    const userId = req.headers["user-id"]; // Assume user ID is passed in the request headers
    if (!userId) {
      ws.close(4001, "User ID is required for connection.");
      return;
    }

    // Store the WebSocket connection with the user ID
    clients.set(userId, ws);
    logger.info(`WebSocket connected: User ID - ${userId}`);

    // Handle incoming messages (if needed)
    ws.on("message", (message) => {
      logger.info(`Message received from User ${userId}: ${message}`);
    });

    // Handle connection close
    ws.on("close", () => {
      clients.delete(userId);
      logger.info(`WebSocket disconnected: User ID - ${userId}`);
    });

    // Handle connection errors
    ws.on("error", (error) => {
      logger.error(`WebSocket error for User ${userId}: ${error.message}`);
    });
  });

  logger.info("WebSocket server initialized.");
}

/**
 * Send a notification to a specific user.
 * @param {String} userId - The ID of the user to send the notification to.
 * @param {Object} notification - Notification payload (e.g., message, task update).
 */
function sendNotification(userId, notification) {
  const ws = clients.get(userId);
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    logger.warn(`WebSocket not available for User ${userId}. Notification queued.`);
    return;
  }

  try {
    ws.send(JSON.stringify(notification));
    logger.info(`Notification sent to User ${userId}: ${JSON.stringify(notification)}`);
  } catch (error) {
    logger.error(`Failed to send notification to User ${userId}: ${error.message}`);
  }
}

/**
 * Broadcast a notification to all connected clients.
 * @param {Object} notification - Notification payload.
 */
function broadcastNotification(notification) {
  clients.forEach((ws, userId) => {
    if (ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(JSON.stringify(notification));
        logger.info(`Broadcast notification sent to User ${userId}`);
      } catch (error) {
        logger.error(`Failed to broadcast notification to User ${userId}: ${error.message}`);
      }
    }
  });
}

/**
 * Gracefully close all WebSocket connections.
 */
function closeConnections() {
  clients.forEach((ws, userId) => {
    try {
      ws.close(1000, "Server shutting down");
      logger.info(`WebSocket connection closed for User ${userId}`);
    } catch (error) {
      logger.error(`Error closing WebSocket connection for User ${userId}: ${error.message}`);
    }
  });
  wss.close(() => {
    logger.info("WebSocket server closed.");
  });
}

module.exports = {
  initializeWebSocket,
  sendNotification,
  broadcastNotification,
  closeConnections,
};
