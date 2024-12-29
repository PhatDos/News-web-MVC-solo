import mongoose from "mongoose";

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  image_url: [{ type: String }],
  video_url: [{ type: String }],
  premium: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ["draft", "published", "rejected", "pending"],
    default: "draft",
  },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  views: { type: Number, default: 1 },
  rejectionNote: { type: String, default: "" },
});

export const Article = mongoose.model("Article", articleSchema);
