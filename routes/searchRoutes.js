// routes/searchRoutes.js
import express from "express";
import { Article } from "../Models/article.js";
import { articleController } from "../Controllers/article.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const query = req.query.q?.trim() || "";

  try {
    if (!query) {
      return res.render("search", {
        CategoryName: "Search Results",
        des: "No results found. Please try another query.",
        article: [],
        newest5Articles: await articleController.getTop5NewestArticles()
      });
    }

    const articles = await Article.find({
      status: "published",
      $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } }
      ]
    })
      .populate("category")
      .populate("tags")
      .lean();

    res.render("search", {
      CategoryName: "Search Results",
      des: `Showing results for: "${query}"`,
      article: articles,
      newest5Articles: await articleController.getTop5NewestArticles()
    });
  } catch (err) {
    console.error("Search Error:", err);
    res.status(500).send("Error during search");
  }
});

export default router;
