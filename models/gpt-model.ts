"use strict";
const mongoose = require('mongoose');

const GptResponseSchema = new mongoose.Schema({
  data: Object,
}, { timestamps: true, versionKey: false, collection: 'GPT' });

const GptMessagessubSchema = new mongoose.Schema({
  role: String,
  content: String
});

const GptMessagesSchema = new mongoose.Schema({
  Queries: [GptMessagessubSchema]
}, { timestamps: true, versionKey: false, collection: 'GPT-Queries' });

const gptResult = mongoose.model('gptResult', GptResponseSchema); 
const gptQuery = mongoose.model('gptQuery', GptMessagesSchema); 

module.exports = { 
  gptResult, gptQuery
}