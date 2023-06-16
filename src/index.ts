import express, { Express, Response, Request } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { registerValidation } from './validations/auth';
import { validationResult, Result } from 'express-validator/src/validation-result';
import UserModel from './models/User';
import checkAuth from './utils/checkAuth';

interface AuthenticatedRequest extends Request {
  userId?: string
}

mongoose
  .connect('mongodb+srv://pcuser876:admin@cluster0.laynzuo.mongodb.net/blog?retryWrites=true&w=majority')
  .then(() => console.log('DB OK'))
  .catch(err => console.log('DB EROOR', err));

const app: Express = express();

app.use(express.json());

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

const handleErrors = async (err: any, res: Response, status: number, message: string) => {
  console.log(err);
  res.status(status).json({ message })
};

app.post('/login', async (req: Request, res: Response) => {
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
})

app.post('/register', registerValidation, async (req: Request, res: Response) => {
  try {
    const errors: Result = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(errors)
    }

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
});

app.get('/me', checkAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ ...user.toObject() });
  } catch (error) {
    return handleErrors(error, res, 500, 'Internal server error');
  }
});

app.listen(4444, () => console.log('Server OK!'));