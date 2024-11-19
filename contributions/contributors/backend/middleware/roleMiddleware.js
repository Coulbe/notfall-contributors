const logger = require("../utils/logger");

// Define a role hierarchy for access control
const roleHierarchy = {
  Admin: ["Admin", "ProjectManager", "Contributor"],
  ProjectManager: ["ProjectManager", "Contributor"],
  Contributor: ["Contributor"],
};

/**
 * Middleware to validate roles dynamically based on role hierarchy.
 * @param {Array} allowedRoles - Array of roles allowed to access the resource.
 */
const validateRole = (allowedRoles) => (req, res, next) => {
  const userRole = req.user?.roles[0]; // Assume the user has a roles array

  if (!userRole || !allowedRoles.includes(userRole)) {
    logger.warn(`Access denied: User role '${userRole}' is not in allowed roles [${allowedRoles}]`);
    return res.status(403).json({ message: `Access denied: Role '${userRole}' is not permitted` });
  }

  logger.info(`Role validation passed for user: ${req.user.username}, Role: ${userRole}`);
  next();
};

/**
 * Middleware to check permissions for specific actions.
 * @param {String} requiredPermission - Permission required to access the resource.
 */
const checkPermissions = (requiredPermission) => (req, res, next) => {
  const userPermissions = req.user?.permissions || []; // Assume permissions are part of the user object

  if (!userPermissions.includes(requiredPermission)) {
    logger.warn(`Access denied: User lacks required permission '${requiredPermission}'`);
    return res.status(403).json({ message: `Access denied: Permission '${requiredPermission}' is required` });
  }

  logger.info(`Permission validation passed for user: ${req.user.username}, Permission: ${requiredPermission}`);
  next();
};

/**
 * Middleware to validate access using a role hierarchy.
 * Automatically grants access if the user's role is higher or equal in the hierarchy.
 * @param {String} requiredRole - Minimum role required to access the resource.
 */
const validateRoleHierarchy = (requiredRole) => (req, res, next) => {
  const userRole = req.user?.roles[0];

  if (!userRole || !roleHierarchy[requiredRole]?.includes(userRole)) {
    logger.warn(`Access denied: User role '${userRole}' does not meet the required role '${requiredRole}'`);
    return res.status(403).json({ message: `Access denied: Minimum role '${requiredRole}' is required` });
  }

  logger.info(`Role hierarchy validation passed for user: ${req.user.username}, Role: ${userRole}`);
  next();
};

/**
 * Middleware to handle multi-role users and validate against multiple allowed roles.
 * @param {Array} allowedRoles - Array of roles allowed to access the resource.
 */
const validateMultiRoles = (allowedRoles) => (req, res, next) => {
  const userRoles = req.user?.roles || []; // User can have multiple roles

  const hasValidRole = userRoles.some((role) => allowedRoles.includes(role));

  if (!hasValidRole) {
    logger.warn(
      `Access denied: User roles '${userRoles}' do not match any allowed roles [${allowedRoles}]`
    );
    return res.status(403).json({ message: `Access denied: Role not permitted` });
  }

  logger.info(`Multi-role validation passed for user: ${req.user.username}, Roles: ${userRoles}`);
  next();
};

module.exports = {
  validateRole,
  checkPermissions,
  validateRoleHierarchy,
  validateMultiRoles,
};
