import express from "express";
import { articleController } from "../Controllers/article.js";

const router = express.Router();

// Hiển thị danh sách các bài viết mới nhất
router.get("/", async (req, res) => {
  try {
    const newest5Articles = await articleController.getTop5NewestArticles();
    let newestArticles = await articleController.getTop10NewestArticles();
    const top4Articles = newestArticles.slice(0, 4);
    const remainingArticles = newestArticles.slice(4);

    res.render("list", {
      article1: top4Articles[0],
      article2: top4Articles[1],
      article3: top4Articles[2],
      article4: top4Articles[3],
      CategoryName: "Latest Articles",
      des: "Browse the latest published articles",
      article: remainingArticles,
      newest5Articles
    });
  } catch (err) {
    console.error("Error loading latest articles:", err);
    res.status(500).send("Error loading latest articles");
  }
});

export default router;
