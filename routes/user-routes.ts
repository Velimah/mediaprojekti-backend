import express, { Request, Response } from "express";
import { MongoError } from "mongodb";
import bcrypt from "bcrypt";
import { User } from "../models/user-model";
import dotenv from "dotenv";
import jwt, { Secret } from "jsonwebtoken";
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
      return res
        .status(500)
        .json({ message: "MongoError: ", error: error.message });
    } else {
      return res
        .status(500)
        .json({ message: "Register error: ", error: String(error) });
    }
  }
});

const jwtsecret: Secret = process.env.JWT_SECRET as string;

const generateToken = (user: { username: string }) => {
  return jwt.sign({ username: user.username }, jwtsecret, { expiresIn: "24h" });
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

    return res.status(200).json({ message: "Login successful", token });
  } catch (error: unknown) {
    if (error instanceof MongoError) {
      return res
        .status(500)
        .json({ message: "MongoError: ", error: error.message });
    } else {
      return res
        .status(500)
        .json({ message: "Login failed", error: String(error) });
    }
  }
});

export { router };
