const Joi = require("joi");

// Schema for validating task creation
const createTaskSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      "string.empty": "Task title is required.",
      "string.min": "Task title must be at least 3 characters.",
      "string.max": "Task title must not exceed 100 characters.",
    }),
  description: Joi.string()
    .max(500)
    .required()
    .messages({
      "string.empty": "Task description is required.",
      "string.max": "Task description must not exceed 500 characters.",
    }),
  requiredSkills: Joi.array()
    .items(Joi.string().min(2))
    .min(1)
    .required()
    .messages({
      "array.min": "At least one required skill must be specified.",
    }),
  priority: Joi.string()
    .valid("High", "Medium", "Low")
    .default("Medium")
    .messages({
      "any.only": "Priority must be either 'High', 'Medium', or 'Low'.",
    }),
  dueDate: Joi.date()
    .greater("now")
    .required()
    .messages({
      "date.greater": "Due date must be a future date.",
    }),
  dependencies: Joi.array()
    .items(Joi.string().pattern(/^[a-f\d]{24}$/i))
    .messages({
      "string.pattern.base": "Each dependency must be a valid ObjectId.",
    }),
  assignedTo: Joi.string().optional(),
});

// Schema for validating task updates
const updateTaskSchema = Joi.object({
  title: Joi.string().min(3).max(100),
  description: Joi.string().max(500),
  requiredSkills: Joi.array().items(Joi.string().min(2)),
  priority: Joi.string().valid("High", "Medium", "Low"),
  dueDate: Joi.date().greater("now"),
  status: Joi.string().valid("Pending", "In Progress", "Completed", "Cancelled"),
  dependencies: Joi.array().items(Joi.string().pattern(/^[a-f\d]{24}$/i)),
});

// Schema for validating task assignment
const assignTaskSchema = Joi.object({
  assignedTo: Joi.string()
    .required()
    .messages({
      "string.empty": "Assigned engineer ID is required.",
    }),
});

module.exports = {
  createTaskSchema,
  updateTaskSchema,
  assignTaskSchema,
};
