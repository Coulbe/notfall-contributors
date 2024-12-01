const { validateToken } = require("../utils/tokenValidator");
const secrets = require("../config/secrets");

/**
 * Middleware to validate Notcoin blockchain tokens.
 * @returns {Function} - Express middleware function.
 */
const notcoinTokenValidator = () => {
  return (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No Notcoin token provided.",
      });
    }

    const validToken = validateToken(token.replace("Bearer ", ""), secrets.NOTCOIN_SECRET, "Notcoin Token");
    if (!validToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired Notcoin token.",
      });
    }

    req.user = validToken;
    next();
  };
};

module.exports = notcoinTokenValidator;
