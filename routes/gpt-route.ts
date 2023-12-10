"use strict";
import express, { Response } from "express";
import dotenv from "dotenv";
import { getRole, Role } from "../roles";
import { gptResult } from "../models/gpt-model";
<<<<<<< HEAD
import { downloadImage } from "../utils/downloadImage";
=======
import * as https from "https";
import * as fs from "fs";
import * as path from "path";
>>>>>>> c569ba17c9b25d262200c1e12e94b6adddcdec2d
dotenv.config();
const router = express.Router();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// interface for response from OpenAI GPT-3.5 API
interface GptResponse {
  choices: [
    {
      message: {
        role: string;
        content: string;
      };
    }
  ];
}

interface DalleResponse {
  data: [
    {
      url: string;
    }
  ];
}

// route for sending queries to OpenAI GPT-3.5 API
router.post("/completions", async (req: { body: { role: Role; prompt: string } }, res: Response) => {
  // start promptGPT function to fetch response from OpenAI GPt-3.5 API
  try {
    const responseContent = await promptGPT(req.body.role, req.body.prompt);
    res.status(200).json(responseContent);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred: ", error: String(error) });
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
      temperature: 0.5,
    }),
  };

  try {
    console.log("fetching gpt", options);
    const response = await fetch("https://api.openai.com/v1/chat/completions", options);
    if (response.ok) {
      const data: GptResponse = (await response.json()) as GptResponse;

      if (data?.choices?.[0]?.message?.content) {
        console.log("success", data);
        // save response to database
        await saveToDatabase(data);

        const htmlData: string = data.choices[0].message.content;

        // return html data to frontend
        return htmlData;
      } else {
        console.log("Invalid or empty response data");
      }
    } else {
      console.log("Error response from API:", response.status, response.statusText);
    }
  } catch (error) {
    console.log("error", error);
    console.error(error);
  }
};

// function for saving response from OpenAI GPT-3.5 API to database
const saveToDatabase = async (data: GptResponse) => {
  const databaseData = new gptResult({ data });
  await databaseData.save();
};

// route for sending queries to OpenAI DALLE image API
type Size = "256x256" | "512x512" | "1024x1024";
router.post("/generations", async (req: { body: { prompt: string; size: Size, username: string } }, res: Response) => {
  try {
<<<<<<< HEAD
    const responseContent = await generateImage(req.body.prompt, req.body.size, req.body.username);
=======
    const responseContent = await generateImage(req.body.prompt, req.body.size);
    console.log("responseContent", responseContent);
>>>>>>> c569ba17c9b25d262200c1e12e94b6adddcdec2d
    res.send(responseContent);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred: ", error: String(error) });
  }
});

// function for fetching response from OpenAI DALLE image API
const generateImage = async (prompt: string, size: Size, username: string) => {
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: prompt,
      n: 1,
      size: size,
    }),
  };

  // fetch image from OpenAI DALLE image API
  try {
    console.log("fetching image for '" + prompt + "'");
    const response = await fetch("https://api.openai.com/v1/images/generations", options);
    const data: DalleResponse = (await response.json()) as DalleResponse;
    console.log("success", data);
    // Download generated img to server, return url for image
    const imageUrl = await downloadImage(data.data[0].url, username);
    // Return url
<<<<<<< HEAD
    return(imageUrl);
=======
    // TODO: return shortened URL
    const imageUrl = await downloadImage(data.data[0].url);
    return imageUrl;
>>>>>>> c569ba17c9b25d262200c1e12e94b6adddcdec2d
  } catch (error) {
    console.error(error);
  }
};

<<<<<<< HEAD
=======
// Function to download an image from a URL and save it to a local folder
const downloadImage = async (url: string) => {
  // http://localhost:8000/ || https://medpal-catkos.northeurope.cloudapp.azure.com/
  const baseURL = "https://medpal-catkos.northeurope.cloudapp.azure.com/";

  return new Promise<string>((resolve, reject) => {
    let imageURL = baseURL;

    // Go up two levels
    const rootFolder = path.join(__dirname, "..", "..", "public");
    const dateFolder = "/" + getLocalDate(); // todays date, in day.month.year format
    const folderPath = rootFolder + dateFolder;

    // Ensure the folder exists, if not, create a new folder
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    // If filename already exists, add a number to it
    // TODO: add username to fileName?
    const fileType = ".png";
    const fileName = "ai";
    let counter = 1;
    while (fs.existsSync(folderPath + "/" + fileName + "_" + counter + fileType)) {
      counter++;
    }

    const newFileName = fileName + "_" + counter + fileType;
    const imagePath = path.join(folderPath, newFileName);

    // Send an HTTP GET request to the URL
    const request = https.get(url, (response) => {
      // Create a writable stream to the local file
      const fileStream = fs.createWriteStream(imagePath);

      // Pipe the response stream to the local file
      response.pipe(fileStream);

      // Listen for the 'end' event to know when the download is complete
      fileStream.on("finish", () => {
        fileStream.close(() => {
          imageURL = imageURL + "public/" + getLocalDate() + "/" + newFileName;
          console.log(`Image downloaded and saved to: ${imagePath}`);
          console.log("Image URL: " + imageURL);

          // Resolve with the imageURL after the image is downloaded
          resolve(imageURL);
        });
      });
    });

    // Handle errors during the HTTPS request
    request.on("error", (err) => {
      console.error("Error downloading the image:", err);

      // Reject with the error
      reject(err);
    });
  });
};

// Get local date
const getLocalDate = () => {
  const date = new Date();

  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };

  const formattedDate = date.toLocaleDateString("fi-FI", options).replace(/\./g, "_"); // Replace dots with underscores

  console.log(formattedDate);
  return formattedDate;
};

>>>>>>> c569ba17c9b25d262200c1e12e94b6adddcdec2d
export { router };
