'use strict';
require('dotenv').config();
const express = require('express');
const router = express.Router();
module.exports = router;
const gptModel = require('../models/gpt-model');
import { getRole } from '../roles';
import { Role } from '../roles';
import { Request, Response } from 'express';

const GPT_KEY = process.env.GPT_KEY;

interface ApiResponse {
  choices: [{
    message: {
      content: string;
    };
  }];
}

router.post('/completions', async (req: Request, res: Response) => {
  try {
    const responseContent = await promptGPT(req.body.role, req.body.prompt);
    res.send(responseContent);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
});

const promptGPT = async (role: Role, prompt: string) => {
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GPT_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: getRole(role),
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  };

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", options);
    const data : ApiResponse = await response.json() as ApiResponse;
    await saveToDatabase(data);
    return data.choices[0].message.content;
  } catch (error) {
    console.error(error);
  }
}

const saveToDatabase = async (data: ApiResponse) => {
  const databaseData = new gptModel({ data });
  await databaseData.save();
}