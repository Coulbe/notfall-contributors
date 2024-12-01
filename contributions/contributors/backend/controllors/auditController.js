const AuditLog = require("../models/AuditLog"); // Import the AuditLog model
const logger = require("../utils/logger"); // Centralized logging utility

/**
 * Logs a user action for compliance and auditing purposes.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.logAction = async (req, res) => {
  const { userId, action, resource, resourceId, details } = req.body;

  try {
    const newLog = new AuditLog({
      userId,
      action,
      resource,
      resourceId,
      details,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    await newLog.save();
    logger.info(`Audit log created for action: ${action} by user: ${userId}`);
    res.status(201).json({ message: "Audit log created successfully.", log: newLog });
  } catch (error) {
    logger.error("Error creating audit log:", error.message);
    res.status(500).json({ message: "Failed to create audit log." });
  }
};

/**
 * Fetches all audit logs with optional filtering for compliance reviews.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.getAuditLogs = async (req, res) => {
  const { userId, action, resource } = req.query;

  const filter = {};
  if (userId) filter.userId = userId;
  if (action) filter.action = action;
  if (resource) filter.resource = resource;

  try {
    const logs = await AuditLog.find(filter).sort({ createdAt: -1 }).populate("userId", "username role");
    res.status(200).json({ message: "Audit logs fetched successfully.", logs });
  } catch (error) {
    logger.error("Error fetching audit logs:", error.message);
    res.status(500).json({ message: "Failed to fetch audit logs." });
  }
};

/**
 * Flags suspicious activity based on predefined rules (e.g., unrecognized IP).
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.flagSuspiciousActivity = async (req, res) => {
  const { userId, action, ipAddress, details } = req.body;

  try {
    const knownIPs = ["192.168.1.1", "203.0.113.42"]; // Replace with your known IPs
    const isSuspicious = !knownIPs.includes(ipAddress);

    const newLog = new AuditLog({
      userId,
      action,
      ipAddress,
      details,
      isSuspicious,
      suspiciousReason: isSuspicious ? "Unrecognized IP address" : null,
    });

    await newLog.save();
    logger.info(`Suspicious activity flagged for user: ${userId}, action: ${action}`);
    res.status(201).json({ message: "Suspicious activity logged.", log: newLog });
  } catch (error) {
    logger.error("Error flagging suspicious activity:", error.message);
    res.status(500).json({ message: "Failed to log suspicious activity." });
  }
};
