import express, { Express } from 'express';
import mongoose from 'mongoose';
import { registerValidation } from './validations/auth';
import checkAuth from './utils/checkAuth';
import * as userController from './controllers/userController';

mongoose
  .connect('mongodb+srv://pcuser876:admin@cluster0.laynzuo.mongodb.net/blog?retryWrites=true&w=majority')
  .then(() => console.log('DB OK'))
  .catch(err => console.log('DB EROOR', err));

const app: Express = express();

app.use(express.json());

app.post('/login', userController.login);
app.post('/register', registerValidation, userController.register);
app.get('/me', checkAuth, userController.userInfo);

app.listen(4444, () => console.log('Server OK!'));