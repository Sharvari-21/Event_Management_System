const { validationResult } = require("express-validator");

/**
 * Runs after express-validator's check(...) chains. If any validation
 * rule failed, responds with 400 and a structured list of field errors.
 * Otherwise, passes control to the controller.
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }

  next();
};

module.exports = validateRequest;