import { Response, Request } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from '../models/User';

interface AuthenticatedRequest extends Request {
  userId?: string
}

const generateToken = (userId: string): string => {
  return jwt.sign(
    {
      _id: userId,
    },
    'secret-123',
    {
      expiresIn: '30d'
    }

  );
}

export const handleErrors = async (err: any, res: Response, status: number, message: string) => {
  console.log(err);
  res.status(status).json({ message })
};

export const register = async (req: Request, res: Response) => {
  try {
    const password: string = req.body.password;
    const salt: string = await bcrypt.genSalt(10);
    const passwordHash: string = await bcrypt.hash(password, salt);

    const document = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash,
    });

    const user = await document.save();

    const token: string = jwt.sign(
      {
        _id: user._id,
      },
      'secret-123',
      {
        expiresIn: '30d'
      }

    )

    res.json({
      ...user.toObject(),
      token
    });

  } catch (err) {
    return handleErrors(err, res, 500, "Error, registration could not be performed");
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ message: 'You are not registered' });
    }

    const isValidPass: boolean = await bcrypt.compare(req.body.password, user.toObject().passwordHash);

    if (!isValidPass) {
      return res.status(400).json({ message: 'Invalid login or password' });
    }

    const token: string = generateToken(user._id);

    res.json({
      ...user.toObject(),
      token
    });

  } catch (err) {
    return handleErrors(err, res, 400, "Failed to login");
  }
};

export const userInfo = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ ...user.toObject() });
  } catch (error) {
    return handleErrors(error, res, 500, 'Internal server error');
  }
};