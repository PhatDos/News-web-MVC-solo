import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  full_name: { type: String, required: true, trim: true },
  role: {
    type: String,
    enum: ["guest", "subscriber", "writer", "editor", "administrator"],
    default: "guest",
    required: true,
  },
  subscription_expiration: {
    type: Date,
    default: () => {
      const date = new Date();
      date.setFullYear(date.getFullYear() + 1);
      return date;
    },
  },
  avaiCategory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
});

export const User = mongoose.model("User", userSchema);
