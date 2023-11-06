import { Request, Response } from 'express';
const PORT = 8000;
require("dotenv").config();
const express = require("express");
const mongoose = require('mongoose');
const routes = require('./routes/gpt');
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use('/gpt', routes);

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello World');
});

const mongoString = process.env.DATABASE_URL
mongoose.connect(mongoString);
const database = mongoose.connection;

mongoose.set('sanitizeFilter', true);

database.on('error', (error: any) => {
  console.log(error);
});

database.once('connected', () => {
  console.log('Database Connected');
});

app.listen(process.env.PORT || PORT);