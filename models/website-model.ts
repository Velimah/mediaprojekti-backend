import mongoose, { Document, Schema } from "mongoose";

interface Website extends Document {
  name: string;
  html: string;
  user: Schema.Types.ObjectId;
}

const websiteSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    html: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true, collection: "SAVED_WEBSITES" }
);

export const Website = mongoose.model<Website>("Website", websiteSchema);
