const Contributor = require('../models/Contributor');
const logger = require('../utils/logger');
const auditService = require('../services/auditService'); // Example service for auditing

// Permissions configuration with default fallback
const permissions = {
  Admin: {
    allowed: ['all'], // Admin has unrestricted access
    restricted: [],   // No restrictions for Admin
  },
  ProjectManager: {
    allowed: ['tasks', 'contributors', 'folders', 'reports'],
    restricted: ['settings'], // Cannot access system settings
  },
  Contributor: {
    allowed: ['assignedTasks', 'assignedFolders'],
    restricted: ['reports', 'settings'],
  },
};

// Default role permissions
const defaultRole = 'Contributor';

/**
 * Validate if the user has one of the allowed roles
 * @param {Array} allowedRoles - Roles allowed to access the resource
 */
exports.validateRole = (allowedRoles) => (req, res, next) => {
  const { role } = req.user;

  if (!allowedRoles.includes(role)) {
    logger.warn(`Access denied for user: ${req.user.username}, Role: ${role}, Allowed Roles: ${allowedRoles}`);
    auditService.logAccess(req.user.username, role, 'Role validation failed', req.originalUrl, false);
    return res.status(403).json({ message: `Access denied: Role '${role}' is not permitted for this action` });
  }

  logger.info(`Role validation passed for user: ${req.user.username}, Role: ${role}`);
  auditService.logAccess(req.user.username, role, 'Role validation succeeded', req.originalUrl, true);
  next();
};

/**
 * Check if the user has permission to access a specific resource
 * @param {string} resource - The resource to validate access for
 */
exports.checkPermissions = (resource) => (req, res, next) => {
  const { role } = req.user;
  const rolePermissions = permissions[role] || permissions[defaultRole];

  // Allow access if role has 'all' access or resource is explicitly allowed
  if (
    rolePermissions.allowed.includes('all') ||
    rolePermissions.allowed.includes(resource) ||
    rolePermissions.allowed.some((r) => resource.startsWith(r)) // Wildcard match (e.g., "tasks/*")
  ) {
    logger.info(`Permission granted for user: ${req.user.username}, Role: ${role}, Resource: ${resource}`);
    auditService.logAccess(req.user.username, role, `Permission granted for ${resource}`, req.originalUrl, true);
    return next();
  }

  // Deny access if explicitly restricted
  if (rolePermissions.restricted?.includes(resource)) {
    logger.warn(`Access denied for user: ${req.user.username}, Role: ${role}, Resource: ${resource}`);
    auditService.logAccess(req.user.username, role, `Permission denied for ${resource}`, req.originalUrl, false);
    return res.status(403).json({ message: `Access denied: Role '${role}' cannot access '${resource}'` });
  }

  // Default deny
  logger.warn(`Access denied by default for user: ${req.user.username}, Role: ${role}, Resource: ${resource}`);
  auditService.logAccess(req.user.username, role, `Default permission denied for ${resource}`, req.originalUrl, false);
  res.status(403).json({ message: `Access denied: Role '${role}' cannot access '${resource}'` });
};

/**
 * Validate hierarchical roles based on precedence
 * @param {string} requiredRole - The minimum role required for access
 */
exports.validateHierarchicalRole = (requiredRole) => (req, res, next) => {
  const { role } = req.user;
  const roleHierarchy = ['Contributor', 'ProjectManager', 'Admin'];

  // Check if user's role meets or exceeds required role level
  if (roleHierarchy.indexOf(role) < roleHierarchy.indexOf(requiredRole)) {
    logger.warn(`Access denied: Insufficient role level for user: ${req.user.username}, Role: ${role}, Required: ${requiredRole}`);
    auditService.logAccess(req.user.username, role, `Insufficient role level for ${requiredRole}`, req.originalUrl, false);
    return res.status(403).json({ message: `Access denied: Insufficient role level for '${requiredRole}'` });
  }

  logger.info(`Hierarchical role validation passed for user: ${req.user.username}, Role: ${role}`);
  next();
};

/**
 * Assign or update a user's role dynamically
 * @param {string} userId - The ID of the user to update
 * @param {string} newRole - The new role to assign
 */
exports.updateRole = async (req, res) => {
  const { userId, newRole } = req.body;

  try {
    const contributor = await Contributor.findById(userId);

    if (!contributor) {
      logger.warn(`Role update failed: User not found (ID: ${userId})`);
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate the new role
    if (!permissions[newRole]) {
      logger.warn(`Role update failed: Invalid role '${newRole}'`);
      return res.status(400).json({ message: `Invalid role: '${newRole}'` });
    }

    contributor.role = newRole;
    await contributor.save();

    logger.info(`Role updated successfully for user: ${contributor.username}, New Role: ${newRole}`);
    auditService.logRoleUpdate(req.user.username, contributor.username, newRole);
    res.status(200).json({ message: `Role updated successfully to '${newRole}'` });
  } catch (error) {
    logger.error(`Error updating role: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Apply a temporary role to a user
 * @param {string} userId - The ID of the user
 * @param {string} tempRole - The temporary role to assign
 * @param {Date} duration - Duration after which the role will be revoked
 */
exports.assignTemporaryRole = async (req, res) => {
  const { userId, tempRole, duration } = req.body;

  try {
    const contributor = await Contributor.findById(userId);

    if (!contributor) {
      logger.warn(`Temporary role assignment failed: User not found (ID: ${userId})`);
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate the temporary role
    if (!permissions[tempRole]) {
      logger.warn(`Temporary role assignment failed: Invalid role '${tempRole}'`);
      return res.status(400).json({ message: `Invalid role: '${tempRole}'` });
    }

    // Assign the temporary role and set a timer to revert it
    const originalRole = contributor.role;
    contributor.role = tempRole;
    await contributor.save();

    logger.info(`Temporary role '${tempRole}' assigned to user: ${contributor.username} for duration: ${duration}ms`);
    auditService.logRoleUpdate(req.user.username, contributor.username, tempRole, 'Temporary Role Assigned');

    setTimeout(async () => {
      contributor.role = originalRole;
      await contributor.save();
      logger.info(`Temporary role '${tempRole}' reverted to original role '${originalRole}' for user: ${contributor.username}`);
      auditService.logRoleUpdate(req.user.username, contributor.username, originalRole, 'Temporary Role Reverted');
    }, duration);

    res.status(200).json({ message: `Temporary role '${tempRole}' assigned successfully for ${duration}ms` });
  } catch (error) {
    logger.error(`Error assigning temporary role: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};
