const Joi = require("joi");

// Schema for validating engineer creation
const createEngineerSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(50)
    .required()
    .messages({
      "string.empty": "Name is required.",
      "string.min": "Name must be at least 3 characters long.",
      "string.max": "Name must not exceed 50 characters.",
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.email": "Please provide a valid email address.",
      "any.required": "Email is required.",
    }),
  skills: Joi.array()
    .items(Joi.string().min(2))
    .min(1)
    .required()
    .messages({
      "array.min": "At least one skill is required.",
    }),
  availability: Joi.boolean()
    .default(true)
    .messages({ "boolean.base": "Availability must be a boolean value." }),
  rating: Joi.number()
    .min(0)
    .max(5)
    .default(0)
    .messages({
      "number.min": "Rating cannot be less than 0.",
      "number.max": "Rating cannot exceed 5.",
    }),
  address: Joi.object({
    city: Joi.string().required().messages({ "string.empty": "City is required." }),
    zip: Joi.string()
      .pattern(/^\d{5}$/)
      .required()
      .messages({
        "string.pattern.base": "ZIP code must be a 5-digit number.",
        "string.empty": "ZIP code is required.",
      }),
  }).required(),
  location: Joi.object({
    latitude: Joi.number()
      .min(-90)
      .max(90)
      .required()
      .messages({
        "number.min": "Latitude must be between -90 and 90 degrees.",
        "number.max": "Latitude must be between -90 and 90 degrees.",
        "any.required": "Latitude is required.",
      }),
    longitude: Joi.number()
      .min(-180)
      .max(180)
      .required()
      .messages({
        "number.min": "Longitude must be between -180 and 180 degrees.",
        "number.max": "Longitude must be between -180 and 180 degrees.",
        "any.required": "Longitude is required.",
      }),
  }).required(),
  hourlyRate: Joi.number()
    .min(0)
    .required()
    .messages({
      "number.base": "Hourly rate must be a number.",
      "number.min": "Hourly rate must be at least 0.",
      "any.required": "Hourly rate is required.",
    }),
});

// Schema for validating engineer updates
const updateEngineerSchema = Joi.object({
  name: Joi.string().min(3).max(50),
  email: Joi.string().email(),
  skills: Joi.array().items(Joi.string().min(2)),
  availability: Joi.boolean(),
  rating: Joi.number().min(0).max(5),
  address: Joi.object({
    city: Joi.string(),
    zip: Joi.string().pattern(/^\d{5}$/),
  }),
  location: Joi.object({
    latitude: Joi.number().min(-90).max(90),
    longitude: Joi.number().min(-180).max(180),
  }),
  hourlyRate: Joi.number().min(0),
});

module.exports = {
  createEngineerSchema,
  updateEngineerSchema,
};
