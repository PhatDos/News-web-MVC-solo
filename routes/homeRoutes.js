import express from "express";
import { Article } from "../Models/article.js";
import { articleController } from "../Controllers/article.js";
import { categoryController } from "../Controllers/category.js";

const router = express.Router();

function convertToEmbedUrls(urls) {
  if (!urls || urls.length === 0) return [];
  return urls.map((str) => {
    let videoId = "";
    for (let i = str.length - 1; i >= 0; i--) {
      if (str[i] === "=" || str[i] === "/") {
        videoId = str.slice(i + 1);
        break;
      }
    }
    return "https://www.youtube.com/embed/" + videoId;
  });
}

// Trang chủ
router.get("/", async (req, res) => {
  try {
    const topViewedArticles =
      await articleController.getTop10MostViewedArticles();
    const newestArticles = await articleController.getTop10NewestArticles();
    const latestArticlesFromCategories =
      await articleController.getLatestArticleFromEachCategory();
    const popularArticles =
      await articleController.getPopularArticlesThisWeek();

    const articles = popularArticles.slice(0, 3);

    res.render("home", {
      article1: articles[0],
      article2: articles[1],
      article3: articles[2],
      topViewedArticles,
      newestArticles,
      latestArticlesFromCategories
    });
  } catch (error) {
    console.error("Error loading home page:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Details
router.get("/details", async (req, res) => {
  const id = req.query.id || 0;
  const data = await articleController.getArticleById(id);
  if (!data) return res.send("No data");

  const category = await categoryController.getCategoryByName(
    data.category.name
  );
  const articles = await Article.find({
    category: category._id,
    status: "published"
  })
    .limit(5)
    .lean();

  const embedUrls = convertToEmbedUrls(data.video_url);
  await articleController.incrementView(id);

  res.render("details", {
    article: data,
    newest5Articles: articles,
    video_url: embedUrls
  });
});

export default router;
