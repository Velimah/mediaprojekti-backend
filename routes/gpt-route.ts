'use strict';
require('dotenv').config();
const express = require('express');
const router = express.Router();
module.exports = router;
const { gptResult, gptQuery } = require('../models/gpt-model'); 
import { getRole, Role } from '../roles';
import { Response } from 'express';
import fs from 'fs';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// interface for response from OpenAI GPT-3.5 API
interface GptResponse {
  choices: [{
    message: {
      role: string;
      content: string;
    };
  }];
}

// type for messages array
type Message = {
  role: string;
  content: string;
};

// array of objects for messagehistory with openAI
const messages: Message[] = [];

// route for sending queries to OpenAI GPT-3.5 API
router.post('/completions', async (req: { body: { role: Role; prompt: string; }; }, res: Response) => {

  // save system role to messages array
  const systemMessage: Message = {
    role: "system",
    content: getRole(req.body.role),
  };
  messages.push(systemMessage);

  // save user prompt to messages array
  const userMessage: Message = {
    role: "user",
    content: req.body.prompt,
  };
  messages.push(userMessage);

  // start promptGPT function to fetch response from OpenAI GPt-3.5 API
  try {
    const responseContent = await promptGPT(messages);
    res.send(responseContent);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
});

// function for fetching response from OpenAI GPT-3.5 API
const promptGPT = async (messages: Message[]) => {
  try {
    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo-1106",
        messages: messages,
      }),
    };

    console.log("fetching gpt");
    const response = await fetch("https://api.openai.com/v1/chat/completions", options);
    const data : GptResponse = await response.json() as GptResponse;
    
    // save response to database
    await saveToDatabase(data);

    // save chatGPT response to messages array
    const assistantMessage: Message = {
      role: data.choices[0].message.role,
      content: data.choices[0].message.content,
    };
    messages.push(assistantMessage);

    // save messagehistory array to database
    await saveQueriesToDatabase(messages);
    const htmlData = data.choices[0].message.content;

    //create html file for query result into test.html
    const filePath = 'test.html';
    fs.writeFileSync(filePath, htmlData);
    console.log("HTML file created successfully at: " + filePath);

    //return html data to frontend
    return htmlData;
  } catch (error) {
    console.error(error);
  }
}

// function for saving response from OpenAI GPT-3.5 API to database
const saveToDatabase = async (data: GptResponse) => {
  const databaseData = new gptResult({ data });
  await databaseData.save();
}

// function for saving messagehistory array to database
const saveQueriesToDatabase = async (messages: Array<{ role: string, content: string }>) => {
  const databaseData = new gptQuery({ Queries: messages });
  await databaseData.save();
}

// route for sending queries to OpenAI DALLE image API
type Size = "256x256" | "512x512" | "1024x1024";
router.post('/generations', async (req: { body: { prompt: string; size: Size; }; }, res: Response) => {
  try {
    const responseContent = await generateImage(req.body.prompt, req.body.size);
    res.send(responseContent);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
});

// function for fetching response from OpenAI DALLE image API
const generateImage = async (prompt: string, size: Size) => {
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

  // fetch image from OpenAI DALLE image API
  try {
    console.log("fetching image");
    const response = await fetch("https://api.openai.com/v1/images/generations", options);
    const data = await response.json();
    console.log("success", data);
  } catch (error) {
    console.error(error);
  }
}