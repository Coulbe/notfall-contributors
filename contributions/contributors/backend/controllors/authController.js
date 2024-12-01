const User = require("../models/User");
const AuditLog = require("../models/AuditLog");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const logger = require("../utils/logger");

// User login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const ipAddress = req.ip; // Capture the user's IP address

  try {
    const user = await User.findOne({ email });
    if (!user) {
      await AuditLog.create({
        userId: null,
        action: "LOGIN",
        resource: "User",
        resourceId: null,
        details: { email, message: "Invalid email" },
        ipAddress,
        isSuspicious: true,
      });
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      await AuditLog.create({
        userId: user._id,
        action: "LOGIN",
        resource: "User",
        resourceId: user._id,
        details: { message: "Invalid password" },
        ipAddress,
        isSuspicious: true,
      });
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Log successful login
    await AuditLog.create({
      userId: user._id,
      action: "LOGIN",
      resource: "User",
      resourceId: user._id,
      details: { message: "Successful login" },
      ipAddress,
    });

    res.status(200).json({ token, user });
  } catch (error) {
    logger.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
