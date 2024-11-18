import api from "./api";

/**
 * Log in the user with email and password.
 * @param {Object} credentials - { email, password }
 * @returns {Object} - { token, user }
 */
export const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data; // Returns token and user info
};

/**
 * Register a new user.
 * @param {Object} userData - { name, email, password, role }
 * @returns {Object} - Confirmation or token
 */
export const register = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

/**
 * Fetch the current authenticated user's profile.
 * @returns {Object} - User details
 */
export const fetchCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

/**
 * Log out the current user.
 * Clears local storage and redirects to login page.
 */
export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};

/**
 * Request a password reset link.
 * @param {string} email - User's email address
 * @returns {Object} - Reset link confirmation
 */
export const requestPasswordReset = async (email) => {
  const response = await api.post("/auth/reset-password", { email });
  return response.data;
};

/**
 * Reset the user's password using a reset token.
 * @param {Object} data - { resetToken, newPassword }
 * @returns {Object} - Password reset confirmation
 */
export const resetPassword = async (data) => {
  const response = await api.post("/auth/reset-password/confirm", data);
  return response.data;
};

/**
 * Enable two-factor authentication for the current user.
 * @returns {Object} - Two-factor authentication setup details
 */
export const enableTwoFactorAuth = async () => {
  const response = await api.post("/auth/two-factor/enable");
  return response.data; // Returns QR code or secret for TOTP setup
};

/**
 * Verify the two-factor authentication code.
 * @param {string} code - Two-factor authentication code
 * @returns {Object} - Verification confirmation
 */
export const verifyTwoFactorAuth = async (code) => {
  const response = await api.post("/auth/two-factor/verify", { code });
  return response.data;
};

/**
 * Authenticate user via social login (e.g., Google, Facebook).
 * @param {Object} data - Social login token or details
 * @returns {Object} - { token, user }
 */
export const socialLogin = async (data) => {
  const response = await api.post("/auth/social-login", data);
  return response.data;
};

/**
 * Fetch all available user roles (Admin only).
 * @returns {Array} - List of roles
 */
export const fetchRoles = async () => {
  const response = await api.get("/auth/roles");
  return response.data;
};

/**
 * Assign a role to a user (Admin only).
 * @param {Object} data - { userId, role }
 * @returns {Object} - Role assignment confirmation
 */
export const assignRole = async (data) => {
  const response = await api.post("/auth/assign-role", data);
  return response.data;
};

/**
 * Revoke a role from a user (Admin only).
 * @param {Object} data - { userId, role }
 * @returns {Object} - Role revocation confirmation
 */
export const revokeRole = async (data) => {
  const response = await api.post("/auth/revoke-role", data);
  return response.data;
};
