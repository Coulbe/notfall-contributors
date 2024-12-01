const Joi = require("joi");

// Schema for validating contributor creation
const createContributorSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(50)
    .required()
    .messages({
      "string.base": "Name must be a valid string.",
      "string.empty": "Name is required.",
      "string.min": "Name must be at least 3 characters long.",
      "string.max": "Name must not exceed 50 characters.",
      "any.required": "Name is a required field.",
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.email": "Please provide a valid email address.",
      "any.required": "Email is a required field.",
    }),
  role: Joi.string()
    .valid("Contributor", "Admin")
    .required()
    .messages({
      "any.only": "Role must be either 'Contributor' or 'Admin'.",
      "any.required": "Role is a required field.",
    }),
  skills: Joi.array()
    .items(Joi.string().min(2).messages({ "string.min": "Each skill must have at least 2 characters." }))
    .min(1)
    .required()
    .messages({
      "array.base": "Skills must be an array of strings.",
      "array.min": "At least one skill is required.",
      "any.required": "Skills are required.",
    }),
  availability: Joi.boolean()
    .default(true)
    .messages({ "boolean.base": "Availability must be a boolean value." }),
});

// Schema for validating contributor updates
const updateContributorSchema = Joi.object({
  name: Joi.string().min(3).max(50).messages({
    "string.min": "Name must be at least 3 characters long.",
    "string.max": "Name must not exceed 50 characters.",
  }),
  email: Joi.string().email().messages({
    "string.email": "Please provide a valid email address.",
  }),
  role: Joi.string()
    .valid("Contributor", "Admin")
    .messages({ "any.only": "Role must be either 'Contributor' or 'Admin'." }),
  skills: Joi.array()
    .items(Joi.string().min(2).messages({ "string.min": "Each skill must have at least 2 characters." })),
  availability: Joi.boolean().messages({
    "boolean.base": "Availability must be a boolean value.",
  }),
});

module.exports = {
  createContributorSchema,
  updateContributorSchema,
};
