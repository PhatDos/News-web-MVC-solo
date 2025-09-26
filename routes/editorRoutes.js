import express from "express";
import { isEditor, isAuth } from "../middlewares/auth.js";
import { articleController } from "../Controllers/article.js";

const router = express.Router();

router.get("/", isAuth, isEditor, async (req, res) => {
  try {
    const getPendingArticlesByUser =
      await articleController.getPendingArticles();
    res.render("editor", {
      getPendingArticlesByUser,
    });
  } catch (error) {
    console.error("Error loading editor page:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
