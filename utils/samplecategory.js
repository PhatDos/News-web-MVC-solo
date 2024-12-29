import mongoose from "mongoose";
import { Category } from "../Models/category.js";

export const createSampleCategories = async () => {
  try {
    // Tạo các sample category
    const categories = [
      { _id: new mongoose.Types.ObjectId(), content: "Technology" },
      { _id: new mongoose.Types.ObjectId(), content: "Science" },
      { _id: new mongoose.Types.ObjectId(), content: "Art" },
      { _id: new mongoose.Types.ObjectId(), content: "Education" }
    ];

    // Lưu các categories vào cơ sở dữ liệu
    await Category.insertMany(categories);
    console.log("Sample categories created successfully!");
  } catch (error) {
    console.error("Error creating sample categories:", error);
  }
};
