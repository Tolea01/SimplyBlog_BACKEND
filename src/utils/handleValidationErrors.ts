import { Request, Response, NextFunction } from "express";
import { validationResult, Result } from 'express-validator/src/validation-result';

export default (req: Request, res: Response, next: NextFunction) => {
  const errors: Result = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json(errors)
  }

  next();
}