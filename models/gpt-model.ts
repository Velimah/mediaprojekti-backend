"use strict";
const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  data: Object,
}, { timestamps: true, versionKey: false, collection: 'GPT' });

const subSchema = new mongoose.Schema({
  role: String,
  content: String
});

const dataSchema2 = new mongoose.Schema({
  Queries: [subSchema]
}, { timestamps: true, versionKey: false, collection: 'GPT-Queries' });

const gptResult = mongoose.model('gptResult', dataSchema); 
const gptQuery = mongoose.model('gptQuery', dataSchema2); 

module.exports = { 
  gptResult, gptQuery
}