const { body } = require("express-validator");
const { EVENT_CATEGORIES } = require("../models/Event");

const eventValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 120 })
    .withMessage("Title cannot exceed 120 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ max: 3000 })
    .withMessage("Description cannot exceed 3000 characters"),

  body("category")
    .optional()
    .isIn(EVENT_CATEGORIES)
    .withMessage(`Category must be one of: ${EVENT_CATEGORIES.join(", ")}`),

  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Date must be a valid date")
    .custom((value) => new Date(value) > new Date())
    .withMessage("Event date must be in the future"),

  body("time")
    .trim()
    .notEmpty()
    .withMessage("Time is required")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Time must be in HH:mm format (e.g. 14:30)"),

  body("location")
    .trim()
    .notEmpty()
    .withMessage("Location is required")
    .isLength({ max: 200 })
    .withMessage("Location cannot exceed 200 characters"),

  body("capacity")
    .notEmpty()
    .withMessage("Capacity is required")
    .isInt({ min: 1 })
    .withMessage("Capacity must be a positive integer"),
];

// A more lenient version for PUT requests where the date may legitimately
// already be in the past relative to "now" if the admin is just fixing a typo
// in the description, etc. Kept separate from create validation for clarity.
const eventUpdateValidator = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ max: 120 })
    .withMessage("Title cannot exceed 120 characters"),

  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Description cannot be empty")
    .isLength({ max: 3000 })
    .withMessage("Description cannot exceed 3000 characters"),

  body("category")
    .optional()
    .isIn(EVENT_CATEGORIES)
    .withMessage(`Category must be one of: ${EVENT_CATEGORIES.join(", ")}`),

  body("date").optional().isISO8601().withMessage("Date must be a valid date"),

  body("time")
    .optional()
    .trim()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Time must be in HH:mm format (e.g. 14:30)"),

  body("location")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Location cannot be empty")
    .isLength({ max: 200 })
    .withMessage("Location cannot exceed 200 characters"),

  body("capacity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Capacity must be a positive integer"),
];

module.exports = { eventValidator, eventUpdateValidator };