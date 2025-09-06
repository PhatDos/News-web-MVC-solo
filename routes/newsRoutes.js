import express from "express";
import { articleController } from "../Controllers/article.js";

const router = express.Router();

// Latest news
router.get("/latest", async (req, res) => {
  try {
    const articles = await articleController.getTop10NewestArticles();
    const newest5Articles = await articleController.getTop5NewestArticles();

    res.render("list", {
      CategoryName: "Latest News",
      des: "Browse the latest articles published.",
      article: articles,
      newest5Articles
    });
  } catch (error) {
    console.error("Error loading latest articles:", error);
    res.status(500).send("Error loading latest articles");
  }
});

export default router;
