import mongoose, { Document, Schema, Model } from "mongoose";

export interface Website extends Document {
  originalPrompt: string;
  name: string;
  html: string;
  previewimage?: string;
  user: Schema.Types.ObjectId;
}

const websiteSchema = new mongoose.Schema(
  {
    originalPrompt: { type: String, required: true },
    name: { type: String, required: true },
    html: { type: String, required: true },
    previewimage: { type: String },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true, collection: "SAVED_WEBSITES" }
);

export const Website: Model<Website> = mongoose.model<Website>("Website", websiteSchema);
