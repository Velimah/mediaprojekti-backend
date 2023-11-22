import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { router as gptroutes } from './routes/gpt-route';
import { router as userroutes } from './routes/user-routes';
import dotenv from 'dotenv';
dotenv.config();
const PORT = process.env.PORT || 8000;
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use('/gpt', gptroutes);
app.use('/user', userroutes);

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello World!');
});

const mongoString = process.env.DATABASE_URL;
if (mongoString) {
  mongoose.connect(mongoString);
  mongoose.set('sanitizeFilter', true);

  const database = mongoose.connection;
  database.once('connected', () => {
    console.log('Database Connected');
  });

  database.on('error', (error: Error) => {
    console.log(error);
  });
}

app.listen(process.env.PORT || PORT , () => { console.log(`Listening on port ${PORT}`) });