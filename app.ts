import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { router as gptroutes } from './routes/gpt-route';
import { router as userroutes } from './routes/user-routes';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config();
const PORT = process.env.PORT || 8000;
const app = express();

app.use(express.json());

const allowlist: string[] = [
  'http://localhost:5173',
  'http://localhost:8000',
  'https://medpal-catkos.northeurope.cloudapp.azure.com',
];
const corsOptions = {
  origin: allowlist,
  credentials: true,
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Access-Control-Allow-Credentials",
  ],
};

app.use(cors(corsOptions));
app.use(express.urlencoded({extended: true}));
const uploadsPath = path.join(__dirname, '..', 'public');
app.use('/public', express.static(uploadsPath));
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