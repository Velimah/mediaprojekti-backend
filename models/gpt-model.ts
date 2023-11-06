"use strict";
const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  data: Object,
}, { timestamps: true, versionKey: false, collection: 'GPT' });

module.exports = mongoose.model('gpt', dataSchema);