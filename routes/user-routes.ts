import express, { Request, Response } from "express";
import { MongoError } from "mongodb";
import bcrypt from "bcrypt";
import { User } from "../models/user-model";
import dotenv from "dotenv";
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

export { router };
