'use strict';
require('dotenv').config();
const express = require('express');
const router = express.Router();
module.exports = router;
const { gptResult, gptQuery } = require('../models/gpt-model'); 
import { getRole } from '../roles';
import { Request, Response } from 'express';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

interface ApiResponse {
  choices: [{
    message: {
      role: string;
      content: string;
    };
  }];
}

type Message = {
  role: string;
  content: string;
};
const messages: Message[] = [];

router.post('/completions', async (req: Request, res: Response) => {

  const systemMessage = {
    role: "system",
    content: getRole(req.body.role),
  };
  messages.push(systemMessage);

  const message = {
    role: "user",
    content: req.body.prompt,
  };
  messages.push(message);

  try {
    const responseContent = await promptGPT(messages);
    res.send(responseContent);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
});

const promptGPT = async (messages: Message[]) => {

  try {
    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: messages,
      }),
    };

    console.log("fetching gpt");
    const response = await fetch("https://api.openai.com/v1/chat/completions", options);
    const data : ApiResponse = await response.json() as ApiResponse;
    await saveToDatabase(data);

    const message = {
      role: data.choices[0].message.role,
      content: data.choices[0].message.content,
    };
    messages.push(message);

    await saveQueriesToDatabase(messages);
    return data.choices[0].message.content;
  } catch (error) {
    console.error(error);
  }

}

const saveToDatabase = async (data: ApiResponse) => {
  const databaseData = new gptResult({ data });
  await databaseData.save();
}

const saveQueriesToDatabase = async (messages: Array<{ role: string, content: string }>) => {
  const databaseData = new gptQuery({ Queries: messages });
  await databaseData.save();
}

/* image generation
const generateImage = async (prompt: string, size: string) => {
  const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
        n: 1,
        size: size
      })
    };

  try {
    console.log("fetching image");
    const response = await fetch("https://api.openai.com/v1/images/generations", options);
    const data = await response.json();
    console.log("success", data);
  } catch (error) {
    console.error(error);
  }
}
*/