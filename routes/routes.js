'use strict';
require('dotenv').config();
const express = require('express');
const router = express.Router();
module.exports = router;
const gptModel = require('../models/gpt-model');

const GPT_KEY = process.env.GPT_KEY;

router.post("/completions", async (req, res) => {
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GPT_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [{ role: "user", content: req.body.message }],
      max_tokens: 5000,
    }),
  };
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", options);
    const responseData = await response.json();
    const newResponseData = new gptModel({ data: responseData });
    await newResponseData.save();
    res.send(responseData);
  } catch (error) {
    console.error(error);
  }
});