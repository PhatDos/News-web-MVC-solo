// routes/searchRoutes.js
import express from "express";
import { Article } from "../Models/article.js";
import { articleController } from "../Controllers/article.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const query = req.query.q || "";

  if (!query.trim()) {
    return res.render("list", {
      CategoryName: "Search Results",
      des: "No results found. Please try another query.",
      article: [],
      newest5Articles: await articleController.getTop5NewestArticles()
    });
  }

  try {
    const articles = await Article.find({
      $and: [
        { status: "published" },
        {
          $or: [
            { title: { $regex: query, $options: "i" } },
            { content: { $regex: query, $options: "i" } }
          ]
        }
      ]
    })
      .populate("category")
      .populate("tags")
      .lean();

    res.render("list", {
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
