const AuditLog = require('../models/AuditLog'); // Audit log model
const logger = require('../utils/logger');
const notificationService = require('../services/notificationService'); // For sending alerts (e.g., email, Slack)

// Middleware to log all access attempts
exports.logAccessAttempt = (resource, critical = false) => async (req, res, next) => {
  const { username, role } = req.user;

  try {
    // Create a log entry
    const logEntry = await AuditLog.create({
      username,
      role,
      resource,
      action: 'Access Attempt',
      status: 'Pending',
      ipAddress: req.ip,
      timestamp: new Date(),
    });

    logger.info(`Access attempt logged: User '${username}', Role '${role}', Resource '${resource}'`);

    // Send notifications for critical access attempts
    if (critical) {
      notificationService.sendAlert({
        title: 'Critical Access Attempt Detected',
        message: `User: ${username}, Role: ${role}, Resource: ${resource}, IP: ${req.ip}`,
        severity: 'high',
      });
    }

    next();
  } catch (error) {
    logger.error(`Error logging access attempt: ${error.message}`);
    res.status(500).json({ message: 'Failed to log access attempt' });
  }
};

// Middleware to log data modifications
exports.logDataModification = (resource, action, critical = false) => async (req, res, next) => {
  const { username, role } = req.user;

  try {
    // Create a log entry for the modification
    const logEntry = await AuditLog.create({
      username,
      role,
      resource,
      action,
      status: 'Success',
      ipAddress: req.ip,
      timestamp: new Date(),
      details: req.body, // Log request body for additional details
    });

    logger.info(`Data modification logged: User '${username}', Role '${role}', Resource '${resource}', Action '${action}'`);

    // Send notifications for critical data modifications
    if (critical) {
      notificationService.sendAlert({
        title: 'Critical Data Modification',
        message: `User: ${username}, Role: ${role}, Resource: ${resource}, Action: ${action}, IP: ${req.ip}`,
        severity: 'high',
      });
    }

    next();
  } catch (error) {
    logger.error(`Error logging data modification: ${error.message}`);
    res.status(500).json({ message: 'Failed to log data modification' });
  }
};

// Middleware to log failed actions
exports.logFailedAction = (resource, action) => async (req, res, next) => {
  const { username, role } = req.user;
  const errorMessage = req.error || 'Unknown error';

  try {
    // Create a log entry for the failed action
    const logEntry = await AuditLog.create({
      username,
      role,
      resource,
      action,
      status: 'Failed',
      ipAddress: req.ip,
      timestamp: new Date(),
      errorMessage, // Log error message for failed actions
    });

    logger.warn(`Failed action logged: User '${username}', Role '${role}', Resource '${resource}', Action '${action}', Error: ${errorMessage}`);

    next();
  } catch (error) {
    logger.error(`Error logging failed action: ${error.message}`);
    res.status(500).json({ message: 'Failed to log failed action' });
  }
};

// Generate an audit trail report with role-specific filtering
exports.generateAuditTrail = async (req, res) => {
  const { username, resource, action, status, startDate, endDate, role } = req.query;

  try {
    const filter = {};

    // Apply filters
    if (username) filter.username = username;
    if (role) filter.role = role;
    if (resource) filter.resource = resource;
    if (action) filter.action = action;
    if (status) filter.status = status;
    if (startDate) filter.timestamp = { $gte: new Date(startDate) };
    if (endDate) filter.timestamp = { ...filter.timestamp, $lte: new Date(endDate) };

    // Fetch audit logs from the database
    const logs = await AuditLog.find(filter).sort({ timestamp: -1 });

    res.status(200).json(logs);
  } catch (error) {
    logger.error(`Error generating audit trail: ${error.message}`);
    res.status(500).json({ message: 'Failed to generate audit trail' });
  }
};

// Integration with external logging providers (e.g., AWS CloudWatch, ELK, Splunk)
exports.logToExternalProvider = async (logEntry) => {
  try {
    // Example: Sending logs to an external provider
    const externalLog = {
      username: logEntry.username,
      role: logEntry.role,
      resource: logEntry.resource,
      action: logEntry.action,
      status: logEntry.status,
      ipAddress: logEntry.ipAddress,
      timestamp: logEntry.timestamp,
      details: logEntry.details,
      errorMessage: logEntry.errorMessage,
    };

    // Replace this with an actual integration (e.g., HTTP request to external service)
    logger.info(`External log sent: ${JSON.stringify(externalLog)}`);
  } catch (error) {
    logger.error(`Error sending log to external provider: ${error.message}`);
  }
};
