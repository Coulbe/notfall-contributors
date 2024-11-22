/**
 * config/database.js
 * MongoDB connection setup for Notfall Contributors system.
 */

const mongoose = require("mongoose");
const logger = require("./logger"); // Custom logger for tracking database events

// MongoDB connection options
const connectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
  autoIndex: true, // Automatically build indexes
  poolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds if unable to connect
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4, // Use IPv4, skip trying IPv6
};

// Retry strategy for failed connections
const maxRetries = 5;
let currentRetries = 0;

/**
 * Connect to MongoDB using Mongoose.
 */
const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/notfall-contributors";

  try {
    const connection = await mongoose.connect(mongoURI, connectionOptions);

    logger.info(`MongoDB connected: ${connection.connection.host}`);
    logger.debug(`Database name: ${connection.connection.name}`);
  } catch (error) {
    logger.error(`Error connecting to MongoDB: ${error.message}`);
    
    if (currentRetries < maxRetries) {
      currentRetries++;
      logger.warn(`Retrying connection attempt ${currentRetries}/${maxRetries}...`);
      setTimeout(connectDB, 5000); // Retry after 5 seconds
    } else {
      logger.error("Max retries reached. Exiting process.");
      process.exit(1); // Exit process with failure
    }
  }
};

/**
 * Disconnect from MongoDB.
 */
const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    logger.info("MongoDB disconnected successfully.");
  } catch (error) {
    logger.error(`Error disconnecting from MongoDB: ${error.message}`);
  }
};

/**
 * Monitor MongoDB connection events.
 */
mongoose.connection.on("connected", () => {
  logger.info("Mongoose connected to MongoDB.");
});

mongoose.connection.on("error", (err) => {
  logger.error(`Mongoose connection error: ${err.message}`);
});

mongoose.connection.on("disconnected", () => {
  logger.warn("Mongoose disconnected from MongoDB.");
});

/**
 * Gracefully close MongoDB connection on app termination.
 */
const handleExit = async () => {
  try {
    await disconnectDB();
    logger.info("App terminated. MongoDB connection closed.");
    process.exit(0);
  } catch (error) {
    logger.error(`Error during app termination: ${error.message}`);
    process.exit(1);
  }
};

process.on("SIGINT", handleExit);
process.on("SIGTERM", handleExit);

module.exports = { connectDB, disconnectDB };
