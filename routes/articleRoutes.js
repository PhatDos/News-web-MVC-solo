import express from "express";
import { Article } from "../Models/article.js";
import { articleController } from "../Controllers/article.js";
import { categoryController } from "../Controllers/category.js";
import { isWriter, isEditor } from "../middleware/middleware.js";

const router = express.Router();

// Convert YouTube link -> embed
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

// Chi tiết bài viết
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

// Writer submit bài viết
router.post("/submit", isWriter, async (req, res) => {
  try {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
      image_url: req.body.image_url || [],
      video_url: req.body.video_url || [],
      premium: req.body.premium === "true",
      status: "pending",
      author: req.session.authUser._id,
      category: req.body.category,
      tags: req.body.tags || [],
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 0
    });
    await newArticle.save();
    res.send(
      '<script>alert("Article saved successfully"); window.location.href="/";</script>'
    );
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving article");
  }
});

// Editor duyệt bài
router.post("/approve", isEditor, async (req, res) => {
  await articleController.publishArticle(req.body.articleId);
  res.redirect("/editor");
});
router.post("/reject", isEditor, async (req, res) => {
  await articleController.rejectArticle(
    req.body.articleIdReject,
    req.body.rejectNote
  );
  res.redirect("/editor");
});

// Latest articles
router.get("/latest", async (req, res) => {
  const articles = await articleController.getTop10NewestArticles();
  const newest5Articles = await articleController.getTop5NewestArticles();
  res.render("list", {
    CategoryName: "Latest News",
    des: "Browse the latest articles published.",
    article: articles,
    newest5Articles
  });
});

export default router;
