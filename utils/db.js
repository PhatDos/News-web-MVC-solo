import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://recdum123:kochomk123@cluster0.ghc5t.mongodb.net/"
    );
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};
