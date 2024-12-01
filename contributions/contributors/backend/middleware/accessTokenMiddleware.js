const { validateToken } = require("../utils/tokenValidator");
const secrets = require("../config/secrets");

/**
 * Middleware to validate API access tokens.
 * @returns {Function} - Express middleware function.
 */
const accessTokenValidator = () => {
  return (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const validToken = validateToken(token.replace("Bearer ", ""), secrets.JWT_SECRET, "Access Token");
    if (!validToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired access token.",
      });
    }

    req.user = validToken; // Attach decoded payload to req.user
    next();
  };
};

module.exports = accessTokenValidator;
