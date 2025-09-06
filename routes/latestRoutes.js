import express from "express";
import { articleController } from "../Controllers/article.js";

const router = express.Router();

// Hiển thị danh sách các bài viết mới nhất
router.get("/", async (req, res) => {
  try {
    const newestArticles = await articleController.getTop10NewestArticles();
    const newest5Articles = await articleController.getTop5NewestArticles();

    res.render("list", {
      CategoryName: "Latest Articles",
      des: "Browse the latest published articles",
      article: newestArticles,
      newest5Articles
    });
  } catch (err) {
    console.error("Error loading latest articles:", err);
    res.status(500).send("Error loading latest articles");
  }
});

export default router;
