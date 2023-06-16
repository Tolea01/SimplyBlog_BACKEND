import { body, ValidationChain } from "express-validator";

export const registerValidation: ValidationChain[] = [
  body('email', 'Email is invalid').isEmail(),
  body('password', 'The number of characters must be at least 5').isLength({ min: 5 }),
  body('fullName', 'The number of characters must be at least 3').isLength({ min: 3 }),
  body('avatarUrl', 'The link is not correct').optional().isURL(),
];

export const loginValidation: ValidationChain[] = [
  body('email', 'Email is invalid').isEmail(),
  body('password', 'The number of characters must be at least 5').isLength({ min: 5 }),
];

export const postCreateValidation: ValidationChain[] = [
  body('title', 'Enter article title').isLength({ min: 3 }).isString(),
  body('text', 'Enter article text').isLength({ min: 10 }).isString(),
  body('tags', 'invalid tag format (specify array)').optional().isString(),
  body('imageUrl', 'invalid link to image').optional().isString(),
];