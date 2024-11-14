const mongoose = require("mongoose");

const { Schema } = mongoose;

/**
 * Define the schema for the Engineer model.
 */
const engineerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // Removes extra spaces
    },
    email: {
      type: String,
      required: true,
      unique: true, // Enforces uniqueness in the database
      lowercase: true,
      match: [/.+\@.+\..+/, "Invalid email address"], // Email validation
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      match: [/^\+?[1-9]\d{1,14}$/, "Invalid phone number"], // E.164 format validation
    },
    password: {
      type: String,
      required: true,
      select: false, // Exclude the password field from queries by default
    },
    skills: {
      type: [String],
      required: true,
      validate: {
        validator: (skills) => skills.length > 0,
        message: "An engineer must have at least one skill.",
      },
    },
    location: {
      type: {
        type: String,
        enum: ["Point"], // Geospatial point type
        default: "Point",
      },
      coordinates: {
        type: [Number], // Array of numbers: [longitude, latitude]
        required: true,
      },
    },
    preferredLocations: {
      type: {
        type: String,
        enum: ["MultiPolygon"], // Allows multiple geospatial regions
        default: "MultiPolygon",
      },
      coordinates: {
        type: [[[Number]]], // Array of arrays of coordinate arrays
        required: true,
      },
    },
    availability: {
      type: [
        {
          date: { type: Date, required: true },
          time: { type: String, required: true }, // e.g., "09:00-17:00"
        },
      ],
      default: [],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5, // Ratings are capped between 0 and 5
    },
    currentTasks: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }], // References the Task model
      default: [],
    },
    completedTasks: {
      type: Number,
      default: 0,
    },
    feedbackScores: {
      type: [Number], // Array of feedback scores (e.g., [4, 5, 3])
      default: [],
    },
    averageFeedbackScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 5, // Calculated field: average of feedback scores
    },
    certifications: {
      type: [String], // e.g., ["Certified Electrician", "HVAC Specialist"]
      default: [],
    },
    profilePicture: {
      type: String, // URL of the profile picture
    },
    createdAt: {
      type: Date,
      default: Date.now, // Automatically sets the creation timestamp
    },
    updatedAt: {
      type: Date,
      default: Date.now, // Automatically sets the update timestamp
    },
  },
  {
    timestamps: true, // Adds `createdAt` and `updatedAt` fields automatically
  }
);

/**
 * Pre-save middleware to calculate the average feedback score.
 */
engineerSchema.pre("save", function (next) {
  if (this.feedbackScores.length > 0) {
    this.averageFeedbackScore =
      this.feedbackScores.reduce((sum, score) => sum + score, 0) /
      this.feedbackScores.length;
  } else {
    this.averageFeedbackScore = 0;
  }
  next();
});

/**
 * Index for geospatial queries.
 */
engineerSchema.index({ location: "2dsphere" });
engineerSchema.index({ preferredLocations: "2dsphere" });

/**
 * Export the Engineer model.
 */
const Engineer = mongoose.model("Engineer", engineerSchema);

module.exports = Engineer;
