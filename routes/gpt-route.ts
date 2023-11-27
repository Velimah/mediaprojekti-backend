'use strict';
import express, { Response } from 'express';
import dotenv from 'dotenv';
import { getRole, Role } from '../roles';
import { gptResult } from '../models/gpt-model';
dotenv.config();
const router = express.Router();

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

interface DalleResponse {
  data: [{
    url: string; 
  }];
}

// route for sending queries to OpenAI GPT-3.5 API
router.post('/completions', async (req: { body: { role: Role; prompt: string; }; }, res: Response) => {

  // start promptGPT function to fetch response from OpenAI GPt-3.5 API
  try {
    const responseContent = await promptGPT(req.body.role, req.body.prompt);
    res.send(responseContent);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
});

// function for fetching response from OpenAI GPT-3.5 API
const promptGPT = async (role: Role, prompt: string) => {
    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo-1106", //gpt-3.5-turbo-16k
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
    console.log("fetching gpt");
    const response = await fetch("https://api.openai.com/v1/chat/completions", options);
    const data : GptResponse = await response.json() as GptResponse;
    console.log("success", data);
    // save response to database
    await saveToDatabase(data);

    const htmlData: string = data.choices[0].message.content;

    //return html data to frontend
    return htmlData;
  } catch (error) {
    console.log("error", error);
    console.error(error);
  }
}

// function for saving response from OpenAI GPT-3.5 API to database
const saveToDatabase = async (data: GptResponse) => {
  const databaseData = new gptResult({ data });
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
    const data: DalleResponse = await response.json() as DalleResponse;
    console.log("success", data);
    // Return url
    // TODO: return shortened URL
    return(data.data[0].url);
  } catch (error) {
    console.error(error);
  }
}

export { router };