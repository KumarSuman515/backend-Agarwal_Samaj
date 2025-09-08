const { body, validationResult } = require("express-validator");

exports.validateClassified = [
  body("person_name").notEmpty().withMessage("Person name is required"),
  body("firm_name").notEmpty().withMessage("Firm name is required"),
  body("firm_address").notEmpty().withMessage("Firm address is required"),
  body("phone").notEmpty().withMessage("Phone is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("business_category").notEmpty().withMessage("Business category is required"),
  // Add more as needed
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
];
