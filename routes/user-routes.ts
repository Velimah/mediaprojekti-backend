import express, { Request, Response } from "express";
import { MongoError } from "mongodb";
import bcrypt from "bcrypt";
import { User } from "../models/user-model";
import { Website } from "../models/website-model";
import dotenv from "dotenv";
import jwt, { Secret } from "jsonwebtoken";
import { authenticateToken } from "../utils/checkAuth";
import { generateImageFromHTML } from "../utils/generateImagesFromHTML";
import AdvanceWebsiteModel, { HtmlBlock } from "../models/advanced-website-model";
dotenv.config();
const router = express.Router();

// Register user
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
    });

    await newUser.save();
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error: unknown) {
    if (error instanceof MongoError) {
      return res.status(500).json({ message: "MongoError: ", error: error.message });
    } else {
      return res.status(500).json({ message: "Register error: ", error: String(error) });
    }
  }
});

const jwtsecret: Secret = process.env.JWT_SECRET as string;

const generateToken = (user: { username: string }) => {
  return jwt.sign({ username: user.username }, jwtsecret, { expiresIn: "4hr" });
};

// Login user
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if password matches
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // JWT token
    const token = generateToken({ username: user.username });
    console.log(token);

    // Set token in auth
    res.setHeader("Authorization", `Bearer ${token}`);

    return res.status(200).json({
      id: user._id,
      username: user.username,
      accessToken: token,
    });
  } catch (error: unknown) {
    if (error instanceof MongoError) {
      return res.status(500).json({ message: "MongoError: ", error: error.message });
    } else {
      return res.status(500).json({ message: "Login failed", error: String(error) });
    }
  }
});

// Logout user
router.post("/logout", async (_req: Request, res: Response) => {
  try {
    // do something here?
    return res.status(200).json({ message: "Logged out" });
  } catch (error: unknown) {
    if (error instanceof MongoError) {
      return res.status(500).json({ message: "MongoError: ", error: error.message });
    } else {
      return res.status(500).json({ message: "Logout failed: ", error: String(error) });
    }
  }
});

// save code
router.post("/savecode", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { originalPrompt, name, html, user } = req.body;

    const imageBuffer = await generateImageFromHTML(html);

    const newWebsite = new Website({
      originalPrompt,
      name,
      html,
      previewimage: imageBuffer.toString("base64"),
      user: user,
    });

    await newWebsite.save();

    return res.status(200).json({ message: "Code saved", _id: newWebsite._id });
  } catch (error: unknown) {
    if (error instanceof MongoError) {
      return res.status(500).json({ message: "MongoError", error: error.message });
    } else {
      return res.status(500).json({ message: "Error saving code", error: String(error) });
    }
  }
});

// get saved websites
router.get("/getsaved/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const savedWebsites = await Website.find({ user: userId });

    return res.status(200).json(savedWebsites);
  } catch (error: unknown) {
    if (error instanceof MongoError) {
      return res.status(500).json({ message: "MongoError", error: error.message });
    } else {
      return res.status(500).json({ message: "Error saving code", error: String(error) });
    }
  }
});

// Update saved website
router.put("/updatesaved/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    const websiteId = req.params.id;
    const { userId, updatedData } = req.body;

    const website = await Website.findById(websiteId);

    if (!website) {
      return res.status(404).json({ message: "Website not found" });
    }

    if (String(website.user) !== userId) {
      return res.status(403).json({ message: "Unauthorized to update this website" });
    }

    if (updatedData.html) {
      const newImageBuffer = await generateImageFromHTML(updatedData.html);
      updatedData.previewimage = newImageBuffer.toString("base64");
    }

    const updatedWebsite = await Website.findByIdAndUpdate(websiteId, updatedData, { new: true });

    return res.status(200).json(updatedWebsite);
  } catch (error: unknown) {
    if (error instanceof MongoError) {
      return res.status(500).json({ message: "MongoError", error: error.message });
    } else {
      return res.status(500).json({ message: "Error updating website", error: String(error) });
    }
  }
});

// Delete saved website
router.delete("/deletesaved/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    console.log("body", req.body);
    const websiteId = req.params.id;
    const userId = req.body.userId;

    const website = await Website.findById(websiteId);

    if (!website) {
      return res.status(404).json({ message: "Website not found" });
    }

    if (String(website.user) !== userId) {
      return res.status(403).json({ message: "Unauthorized to delete this website" });
    }

    await Website.findByIdAndDelete(websiteId);

    return res.status(200).json({ message: "Website deleted" });
  } catch (error: unknown) {
    if (error instanceof MongoError) {
      return res.status(500).json({ message: "MongoError", error: error.message });
    } else {
      return res.status(500).json({ message: "Error deleting website", error: String(error) });
    }
  }
});

// get saved advanced websites
router.get("/getsavedadvanced/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const savedWebsites = await AdvanceWebsiteModel.find({ user: userId });

    return res.status(200).json(savedWebsites);
  } catch (error: unknown) {
    if (error instanceof MongoError) {
      return res.status(500).json({ message: "MongoError", error: error.message });
    } else {
      return res.status(500).json({ message: "Error saving code", error: String(error) });
    }
  }
});

// Update saved advanced website
router.put("/updatesavedadvanced/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    const websiteId = req.params.id;
    const { userId, updatedData } = req.body;

    console.log(updatedData);

    const website = await AdvanceWebsiteModel.findById(websiteId);

    if (!website) {
      return res.status(404).json({ message: "Website not found" });
    }

    if (String(website.user) !== userId) {
      return res.status(403).json({ message: "Unauthorized to update this website" });
    }

    if (updatedData.originalCode) {
      const newImageBuffer = await generateImageFromHTML(updatedData.originalCode);
      updatedData.previewimage = newImageBuffer.toString("base64");
    }

    const updatedWebsite = await AdvanceWebsiteModel.findByIdAndUpdate(websiteId, updatedData, { new: true });

    return res.status(200).json(updatedWebsite);
  } catch (error: unknown) {
    if (error instanceof MongoError) {
      return res.status(500).json({ message: "MongoError", error: error.message });
    } else {
      return res.status(500).json({ message: "Error updating website", error: String(error) });
    }
  }
});

// delete website made with advanced editor
router.delete("/deleteadvancedsaved/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    const websiteId = req.params.id;
    const userId = req.body.userId;

    const website = await AdvanceWebsiteModel.findById(websiteId);

    if (!website) {
      return res.status(404).json({ message: "Website not found" });
    }

    if (String(website.user) !== userId) {
      return res.status(403).json({ message: "Unauthorized to delete this website" });
    }

    await AdvanceWebsiteModel.findByIdAndDelete(websiteId);

    return res.status(200).json({ message: "Website deleted" });
  } catch (error: unknown) {
    if (error instanceof MongoError) {
      return res.status(500).json({ message: "MongoError", error: error.message });
    } else {
      return res.status(500).json({ message: "Error deleting website", error: String(error) });
    }
  }
});

// save website made with advanced editor
router.post("/advancedsavecode", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { originalCode, name, cssLibrary, html, user } = req.body;

    const imageBuffer = await generateImageFromHTML(originalCode);
    const htmlarray = html as HtmlBlock[];

    const newWebsite = new AdvanceWebsiteModel({
      originalCode,
      name,
      cssLibrary,
      htmlarray,
      previewimage: imageBuffer.toString("base64"),
      user: user,
    });

    await newWebsite.save();

    return res.status(200).json({ message: "Code saved", _id: newWebsite._id });
  } catch (error: unknown) {
    if (error instanceof MongoError) {
      return res.status(500).json({ message: "MongoError", error: error.message });
    } else {
      return res.status(500).json({ message: "Error saving code", error: String(error) });
    }
  }
});

export { router };
