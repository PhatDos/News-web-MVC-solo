import { Category } from "../Models/category.js";

export const categoryController = {
  createCategory: async (name, description) => {
    try {
      // Check if category with the same name exists
      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        throw new Error("Category already exists");
      }

      // Create and save the new category
      const newCategory = new Category({ name, description });
      await newCategory.save();

      return newCategory; // Return the created category
    } catch (err) {
      console.error(err);
      throw err; // Propagate the error for the caller to handle
    }
  },
  getAllCategories: async function () {
    try {
      const categories = await Category.find().lean();
      return categories;
    } catch (err) {
      console.error(err);
      return { message: "Server error" };
    }
  },
  getCategoryById: async (id) => {
    try {
      const category = await Category.findById(id).lean();
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      return category;
    } catch (err) {
      console.error(err);
      return { message: "Server error" };
    }
  },
  getCategoryByName: async (name) => {
    try {
      const category = await Category.findOne({ name }).lean();
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      return category;
    } catch (err) {
      console.error(err);
      return { message: "Server error" };
    }
  },
  updateCategory: async (id, name, description) => {
    try {
      // Find and update the category
      const updatedCategory = await Category.findByIdAndUpdate(
        id,
        { name, description, updatedAt: Date.now() },
        { new: true }
      );

      if (!updatedCategory) {
        return res.status(404).json({ message: "Category not found" });
      }

      return updatedCategory;
    } catch (err) {
      console.error(err);
      return { message: "Server error" };
    }
  },
  deleteCategory: async (id) => {
    try {
      const deletedCategory = await Category.findByIdAndDelete(id);

      if (!deletedCategory) {
        return res.status(404).json({ message: "Category not found" });
      }

      return { message: "Category deleted successfully" };
    } catch (err) {
      console.error(err);
      return { message: "Server error" };
    }
  }
};
