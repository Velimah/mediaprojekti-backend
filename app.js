const PORT = 8000;
require("dotenv").config();
const express = require("express");
const mongoose = require('mongoose');
const routes = require('./routes/routes');
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use('/gpt', routes);

app.get('/', (req, res) => {
  res.send('Hello World');
});

const mongoString = process.env.DATABASE_URL
mongoose.connect(mongoString);
const database = mongoose.connection;

// sanitize the input to prevent NoSQL injection
mongoose.set('sanitizeFilter', true);

database.on('error', (error) => {
  console.log(error);
});

database.once('connected', () => {
  console.log('Database Connected');
});

app.listen(process.env.PORT || 8000);