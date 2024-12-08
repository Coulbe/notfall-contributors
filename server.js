/**
 * server.js
 * Entry point for the Notfall backend server.
 */

const http = require("http");
const app = require("./contributions/contributors/backend/app");
const mongoose = require("mongoose");
const logger = require("./contributions/contributors/backend/utils/logger");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    logger.info("Connected to MongoDB");
    // Start the server only after a successful DB connection
    const server = http.createServer(app);
    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
  });
