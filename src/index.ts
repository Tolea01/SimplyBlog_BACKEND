import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import multer, { Multer, StorageEngine } from 'multer';
import { registerValidation, loginValidation, postCreateValidation } from './validations';
import checkAuth from './utils/checkAuth';
import * as userController from './controllers/userController';
import * as postController from './controllers/postController';
import handleValidationErrors from './utils/handleValidationErrors';

interface MulterCallback<T> {
  (error: Error | null, result: T): void
}

mongoose
  .connect('mongodb+srv://pcuser876:admin@cluster0.laynzuo.mongodb.net/blog?retryWrites=true&w=majority')
  .then(() => console.log('DB OK'))
  .catch(err => console.log('DB EROOR', err));

const app: any = express();

app.use(express.json());
app.use('/uploads', express.static('uploads'));

const storage: StorageEngine = multer.diskStorage({
  destination: (_: any, __: any, cb: MulterCallback<string>) => {
    cb(null, 'uploads');
  },
  filename: (_: any, file: Express.Multer.File, cb: MulterCallback<string>) => {
    cb(null, file.originalname)
  }
});

const upload: Multer = multer({ storage });

app.post('/login', loginValidation, handleValidationErrors, userController.login);
app.post('/register', registerValidation, handleValidationErrors, userController.register);
app.get('/me', checkAuth, userController.userInfo);

app.post('/upload', checkAuth, upload.single('image'), (req: Request, res: Response) => {
  if (req.file) {
    res.json({
      url: `/uploads/${req.file.originalname}`
    });
  } else {
    res.status(400).json({ error: 'No file uploaded.' });
  }
});


app.get('/posts', postController.getAll);
app.get('/posts/:id', postController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, postController.create);
app.delete('/posts/:id', checkAuth, postController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, postController.update);

app.listen(4444, () => console.log('Server OK!'));