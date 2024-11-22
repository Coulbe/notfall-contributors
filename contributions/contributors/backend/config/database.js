/**
 * config/database.js
 * This module handles the MongoDB connection setup for the Notfall Contributors system.
 * It includes features like retry logic, connection monitoring, and graceful shutdown handling.
 */

const mongoose = require("mongoose"); // Mongoose is an ODM library for MongoDB
const logger = require("./logger"); // Custom logger for tracking events and errors

// MongoDB connection options for optimized performance and compatibility
const connectionOptions = {
  useNewUrlParser: true, // Use the new URL string parser
  useUnifiedTopology: true, // Use the new Server Discover and Monitoring engine
  useCreateIndex: true, // Enable index creation to avoid deprecation warnings
  useFindAndModify: false, // Use `findOneAndUpdate()` instead of deprecated methods
  autoIndex: true, // Automatically build indexes in the database
  poolSize: 10, // Maintain up to 10 concurrent socket connections
  serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds if unable to connect
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4, // Use IPv4 protocol (skips trying IPv6)
};

// Retry configuration
const maxRetries = 5; // Maximum number of retry attempts
let currentRetries = 0; // Counter for the current retry attempt

/**
 * Connect to MongoDB using Mongoose.
 * Logs events for debugging and automatically retries on failure.
 */
const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/notfall-contributors";

  try {
    // Establish a connection to the MongoDB server
    const connection = await mongoose.connect(mongoURI, connectionOptions);

    // Log the successful connection and database details
    logger.info(`MongoDB connected: ${connection.connection.host}`);
    logger.debug(`Database name: ${connection.connection.name}`);
  } catch (error) {
    // Log the error details
    logger.error(`Error connecting to MongoDB: ${error.message}`);

    // Retry logic: Attempt to reconnect if the max retry limit is not reached
    if (currentRetries < maxRetries) {
      currentRetries++;
      logger.warn(`Retrying connection attempt ${currentRetries}/${maxRetries}...`);
      setTimeout(connectDB, 5000); // Retry after a 5-second delay
    } else {
      // Exit the application if maximum retries are exhausted
      logger.error("Max retries reached. Exiting process.");
      process.exit(1); // Terminate the Node.js process with an error code
    }
  }
};

/**
 * Disconnect from MongoDB.
 * Typically used during application shutdown or testing.
 */
const disconnectDB = async () => {
  try {
    await mongoose.disconnect(); // Close all active connections
    logger.info("MongoDB disconnected successfully."); // Log success
  } catch (error) {
    logger.error(`Error disconnecting from MongoDB: ${error.message}`); // Log any errors
  }
};

/**
 * Monitor MongoDB connection events.
 * These events help track the current state of the database connection.
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
 * Gracefully handle application termination (e.g., SIGINT or SIGTERM signals).
 * Ensures the MongoDB connection is closed properly before exiting the app.
 */
const handleExit = async () => {
  try {
    await disconnectDB(); // Disconnect from MongoDB
    logger.info("App terminated. MongoDB connection closed."); // Log the event
    process.exit(0); // Exit the process successfully
  } catch (error) {
    logger.error(`Error during app termination: ${error.message}`); // Log any errors
    process.exit(1); // Exit with an error code
  }
};

// Listen for termination signals
process.on("SIGINT", handleExit); // Handle Ctrl+C in terminal
process.on("SIGTERM", handleExit); // Handle termination signal in production environments

// Export the connectDB and disconnectDB functions for use in other parts of the application
module.exports = { connectDB, disconnectDB };

