import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }
  return next();
};

export const validateSignUpRequest = [
  body("username")
    .isString()
    .notEmpty()
    .withMessage("Username can not be left blank.")
    .isLength({ min: 6 })
    .withMessage("Username must be as least 6 characters."),

  body("email")
    .notEmpty()
    .withMessage("Email can not be left blank.")
    .isEmail()
    .withMessage("Invalied email address."),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long.")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter.")
    .matches(/\d/)
    .withMessage("Password must contain at least one number.")
    .notEmpty()
    .withMessage("Password is required."),

  handleValidationErrors,
];