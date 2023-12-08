import mongoose, { Document, Schema, Model } from "mongoose";

export interface HtmlBlock {
  id: number;
  name: string;
  content: string;
}

export interface AdvanceWebsite extends Document {
  originalCode: string;
  name: string;
  cssLibrary: string;
  htmlarray: HtmlBlock[];
  previewimage: string;
  user: Schema.Types.ObjectId;
}

const HtmlBlockSchema = new Schema({
  id: Number,
  name: String,
  content: String,
});

const AdvanceWebsiteSchema = new Schema<AdvanceWebsite>(
  {
    originalCode: { type: String, required: true },
    name: { type: String, required: true },
    cssLibrary: { type: String, required: true },
    htmlarray: [HtmlBlockSchema],
    previewimage: String,
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true, collection: "SAVED_ADVANCEDWEBSITES" }
);

interface AdvanceWebsiteModel extends Model<AdvanceWebsite> {}

const AdvanceWebsiteModel: AdvanceWebsiteModel = mongoose.model<
  AdvanceWebsite,
  AdvanceWebsiteModel
>("AdvanceWebsite", AdvanceWebsiteSchema);

export default AdvanceWebsiteModel;
