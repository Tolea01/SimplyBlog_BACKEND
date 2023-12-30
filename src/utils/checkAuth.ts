import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface ExtendedRequest extends Request {
  userId?: string;
}

export default (req: ExtendedRequest, res: Response, next: NextFunction) => {
  const token: string | undefined = (req.headers.authorization || '').replace(/Bearer\s?/, '');

  if (token) {
    try {
      const decoded: JwtPayload | string = jwt.verify(token, 'secret-123');

      req.userId = typeof decoded === 'string' ? decoded : decoded._id;

      next();
    } catch (error) {
      return res.status(403).json({
        message: 'No access!'
      });
    }
  } else {
    return res.status(403).json({
      message: 'No access!'
    });
  }
}
///