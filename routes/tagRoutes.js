import { Router } from "express";
import { tagController } from "../Controllers/tag.js";
import { Article } from "../Models/article.js";
import { isAuth, isAdmin } from "../middlewares/auth.js";

const router = Router();

// Tạo tag mới (admin)
router.post("/", isAuth, isAdmin, async (req, res) => {
  try {
    const { tagName } = req.body;
    await tagController.createTag(tagName);
    res.redirect("/administrator");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating tag");
  }
});

// Xoá tag (admin)
router.post("/delete/:id", isAuth, isAdmin, async (req, res) => {
  try {
    await tagController.deleteTag(req.params.id);
    res.redirect("/administrator");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting tag");
  }
});

// Xem bài viết theo tag
router.get("/", async (req, res) => {
  try {
    const name = req.query.name || "";
    const tag = await tagController.getTagByName(name);

    if (!tag) {
      return res.send("Không có tag này");
    }

    const articles = await Article.find({
      tags: tag._id,
      status: "published",
    }).lean();

    res.render("listTag", {
      TagName: tag.name,
      article: articles,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading tag");
  }
});

export default router;
