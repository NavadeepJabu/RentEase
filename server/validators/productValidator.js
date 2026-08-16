import { body, validationResult } from "express-validator";

export const validateProduct = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required"),

  body("category")
    .isIn(["Furniture", "Appliance"])
    .withMessage("Category must be Furniture or Appliance"),

  body("subCategory")
    .trim()
    .notEmpty()
    .withMessage("Subcategory is required"),

  body("brand")
    .trim()
    .notEmpty()
    .withMessage("Brand is required"),

  body("description")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters"),

  body("monthlyRent")
    .isFloat({ min: 1 })
    .withMessage("Monthly rent must be greater than 0"),

  body("securityDeposit")
    .isFloat({ min: 0 })
    .withMessage("Security deposit cannot be negative"),

  body("quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    next();
  },
];