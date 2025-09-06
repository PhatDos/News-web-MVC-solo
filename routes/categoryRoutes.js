import { Router } from "express";
import { categoryController } from "../Controllers/category.js";
import { Article } from "../Models/article.js";
import { isAuth, isAdmin } from "../middleware/middleware.js";

const router = Router();

// Tạo category mới (chỉ admin)
router.post("/", isAuth, isAdmin, async (req, res) => {
  try {
    const { catagoryName, catagoryDes } = req.body;
    await categoryController.createCategory(catagoryName, catagoryDes);
    res.redirect("/administrator");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating category");
  }
});

// Xoá category
router.post("/delete/:id", isAuth, isAdmin, async (req, res) => {
  try {
    await categoryController.deleteCategory(req.params.id);
    res.redirect("/administrator");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting category");
  }
});

// Xem bài viết theo category
router.get("/", async (req, res) => {
  try {
    const name = req.query.name || "";
    const category = await categoryController.getCategoryByName(name);

    if (!category) {
      return res.send("Không có chuyên mục này");
    }

    const articles = await Article.find({
      category: category._id,
      status: "published"
    }).lean();

    const top4Articles = await Article.find({
      category: category._id,
      status: "published"
    })
      .sort({ views: -1 })
      .limit(4)
      .lean();

    res.render("list", {
      article1: top4Articles[0],
      article2: top4Articles[1],
      article3: top4Articles[2],
      article4: top4Articles[3],
      CategoryName: req.query.name,
      des: category.description,
      article: articles,
      newest5Articles: await categoryController.getAllCategories() // hoặc truyền newest5Articles từ controller articles
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading category");
  }
});

export default router;
