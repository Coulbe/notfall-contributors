/**
 * app.js
 * Initializes and configures the Express application.
 */

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const { errorHandler } = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const contributorRoutes = require("./routes/contributorRoutes");
const taskRoutes = require("./routes/taskRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/contributors", contributorRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/notifications", notificationRoutes);

// Health Check Route
app.get("/health", (req, res) => res.status(200).send("API is healthy"));

// Error Handling Middleware
app.use(errorHandler);

module.exports = app;
