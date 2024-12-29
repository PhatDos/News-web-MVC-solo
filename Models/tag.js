import mongoose from "mongoose";
const tagSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Tag = mongoose.model("Tag", tagSchema);
