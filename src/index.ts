import express, { Express, Application } from 'express';
import mongoose from 'mongoose';
import { registerValidation, loginValidation, postCreateValidation } from './validations';
import checkAuth from './utils/checkAuth';
import * as userController from './controllers/userController';
import * as postController from './controllers/postController';

mongoose
  .connect('mongodb+srv://pcuser876:admin@cluster0.laynzuo.mongodb.net/blog?retryWrites=true&w=majority')
  .then(() => console.log('DB OK'))
  .catch(err => console.log('DB EROOR', err));

const app: any = express();

app.use(express.json());

app.post('/login', loginValidation, userController.login);
app.post('/register', registerValidation, userController.register);
app.get('/me', checkAuth, userController.userInfo);

app.get('/posts', postController.getAll);
app.get('/posts/:id', postController.getOne);
app.post('/posts', checkAuth, postCreateValidation, postController.create);
app.delete('/posts/:id', checkAuth, postController.remove);
app.patch('/posts/:id', checkAuth, postController.update);

app.listen(4444, () => console.log('Server OK!'));