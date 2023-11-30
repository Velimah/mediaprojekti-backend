import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { router as gptroutes } from './routes/gpt-route';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config();
const PORT = process.env.PORT || 8000;
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: true}));
const uploadsPath = path.join(__dirname, '..', 'public');
app.use('/public', express.static(uploadsPath));
app.use('/gpt', gptroutes);

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