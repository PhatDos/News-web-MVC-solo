// routes/writerRoutes.js
import express from "express";
import { articleController } from "../Controllers/article.js";
import { categoryController } from "../Controllers/category.js";
import { tagController } from "../Controllers/tag.js";
import { isWriter } from "../middleware/middleware.js";

const router = express.Router();

// Danh sách bài viết của writer
router.get("/articles", isWriter, async (req, res) => {
  const id = req.session.authUser._id || 0;
  const data = await articleController.getArticleByUser(id);
  if (!data) {
    return res.send("No data");
  }

  res.render("articleOfWriter", {
    article: data,
    usernamee: req.session.authUser.username
  });
});

// Trang tạo bài viết mới
router.get("/", isWriter, async (req, res) => {
  const category = await categoryController.getAllCategories();
  res.render("writer", {
    category: category,
    tag: await tagController.getAllTags()
  });
});

export default router;
