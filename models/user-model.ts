"use strict";
import mongoose, { Document } from "mongoose";

interface User extends Document {
  username: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true, collection: "USERS" }
);

export const User = mongoose.model<User>("User", userSchema);
