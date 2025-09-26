// routes/writerRoutes.js
import express from "express";
import { Article } from "../Models/article.js";
import { articleController } from "../Controllers/article.js";
import { categoryController } from "../Controllers/category.js";
import { tagController } from "../Controllers/tag.js";
import { isWriter, verifyRole } from "../middlewares/auth.js";

const router = express.Router();

// Trang tạo bài viết mới
router.get("/", isWriter, async (req, res) => {
  const category = await categoryController.getAllCategories();
  const tag = await tagController.getAllTags();

  res.render("writer", {
    category,
    tag,
  });
});

// Danh sách bài viết của writer
router.get("/articles", isWriter, async (req, res) => {
  const id = req.session.authUser._id || 0;
  const data = await articleController.getArticleByUser(id);

  if (!data || data.length === 0) {
    return res.render("articleOfWriter", {
      article: [],
      username: req.session.authUser.username,
      message: "No articles found",
    });
  }

  res.render("articleOfWriter", {
    article: data,
    username: req.session.authUser.username,
  });
});

// Submit bài viết mới
router.post(
  "/submit_article",
  verifyRole(["writer", "administrator"]),
  async (req, res) => {
    try {
      const newArticle = new Article({
        title: req.body.title,
        content: req.body.content,
        image_url: req.body.image_url || [], // Mảng ảnh
        video_url: req.body.video_url || [], // Mảng video
        premium: req.body.premium === "true",
        status: "pending",
        author: req.session.authUser._id, // ID người viết từ session
        category: req.body.category,
        tags: req.body.tags || [], // Mảng tags
        createdAt: new Date(),
        updatedAt: new Date(),
        views: 0,
      });

      await newArticle.save();
      console.log("New Article Saved:", newArticle);

      res.send("Article saved successfully");
    } catch (err) {
      console.error("Error saving article:", err);
      res.status(500).send("Error saving article");
    }
  },
);

export default router;
