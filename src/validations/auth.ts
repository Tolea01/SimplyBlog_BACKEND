import { body, ValidationChain } from "express-validator";

export const registerValidation: ValidationChain[] = [
  body('email', 'Email is invalid').isEmail(),
  body('password', 'The number of characters must be at least 5').isLength({ min: 5 }),
  body('fullName', 'The number of characters must be at least 3').isLength({ min: 3 }),
  body('avatarUrl', 'The link is not correct').optional().isURL(),
]