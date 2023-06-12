import express, { Express, Response, Request } from 'express';
import jwt, { Secret } from "jsonwebtoken";
import mongoose from 'mongoose';

mongoose.connect('mongodb+srv://pcuser876:admin@cluster0.laynzuo.mongodb.net/?retryWrites=true&w=majority')
.then(() => console.log('DB OK'))
.catch(err => console.log('DB EROOR', err));

const app: Express = express();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.post('/login', (req: Request, res: Response) => {
  interface Payload {
    email: string,
    fullName: string
  }

  const secret: Secret = 'secret-key';

  const token: string = jwt.sign({
    email: req.body.email,
    fullName: 'test'
  } as Payload, secret);

  res.json({
    succes: true,
    token
  });
})

app.listen(4444, () => console.log('Server OK!'));;