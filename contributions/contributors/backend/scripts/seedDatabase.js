const mongoose = require("mongoose");
const Task = require("../models/Task");
const taskSeeds = require("../seeds/taskSeeds");
const config = require("../config/database");

(async () => {
  try {
    // Connect to the database
    await mongoose.connect(config.mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Database connected!");

    // Clear existing tasks
    await Task.deleteMany({});
    console.log("Existing tasks cleared!");

    // Seed new tasks
    await Task.insertMany(taskSeeds);
    console.log(`${taskSeeds.length} tasks seeded successfully!`);

    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
})();
