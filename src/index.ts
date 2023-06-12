import express, { Express, Response, Request } from 'express';

const app: Express = express();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!')
});

app.listen(4444, () => console.log('Server OK!'));