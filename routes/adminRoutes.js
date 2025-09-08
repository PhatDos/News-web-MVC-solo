import express from "express";
import { isAuth, isAdmin } from "../middleware/middleware.js";
import { categoryController } from "../Controllers/category.js";
import { tagController } from "../Controllers/tag.js";
import { articleController } from "../Controllers/article.js";
import { userController } from "../Controllers/user.js";

const router = express.Router();

router.get("/", isAuth, isAdmin, async (req, res) => {
  try {
    const categories = await categoryController.getAllCategories();
    const tags = await tagController.getAllTags();
    const pendingArticles = await articleController.getPendingArticles();
    const users = await userController.getAllUsers();
    const editors = await userController.getEditorsOnly();

    res.render("administrator", {
      allCategory: categories,
      allTags: tags,
      getPendingArticles: pendingArticles,
      getAllUsers: users,
      getEditorsOnly: editors,
      getAllCategories: categories // nếu cần dùng riêng cho editorModal
    });
  } catch (error) {
    console.error("Error loading admin page:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
