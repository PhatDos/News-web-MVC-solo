import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  full_name: { type: String, required: true },
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
      date.setFullYear(date.getFullYear() + 1); // Cộng thêm 1 năm
      return date;
    },
  },
  avaiCategory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
});

export const User = mongoose.model("User", userSchema);
