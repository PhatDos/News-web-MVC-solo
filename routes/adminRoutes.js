import express from "express";
import { isAuth, isAdmin } from "../middleware/middleware.js";
import { categoryController } from "../Controllers/category.js";
import { tagController } from "../Controllers/tag.js";
import { articleController } from "../Controllers/article.js";
import { userController } from "../Controllers/user.js";

const router = express.Router();

// Trang quản trị
router.get("/administrator", isAuth, isAdmin, async (req, res) => {
  try {
    const allCategories = await categoryController.getAllCategories();
    const allTags = await tagController.getAllTags();
    const getPendingArticles = await articleController.getPendingArticles();
    const getAllUsers = await userController.getAllUsers();
    const getEditorsOnly = await userController.getEditorsOnly();
    const getAllCategories = await categoryController.getAllCategories();

    res.render("administrator", {
      allCategory: allCategories,
      allTags,
      getPendingArticles,
      getAllUsers,
      getEditorsOnly,
      getAllCategories
    });
  } catch (error) {
    console.error("Error loading admin page:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
