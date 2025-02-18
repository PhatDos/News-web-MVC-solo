import express from "express";
import { engine } from "express-handlebars";
import { connectDB } from "./utils/db.js";
import {
  isAuth,
  isAdmin,
  isWriter,
  isEditor
} from "./middleware/middleware.js";

import bcrypt from "bcryptjs";

import { articleController } from "./Controllers/article.js";
import { categoryController } from "./Controllers/category.js";
import { tagController } from "./Controllers/tag.js";
import { userController } from "./Controllers/user.js";
import session from "express-session";

import hbs_section from "express-handlebars-sections";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

app.set("view engine", "hbs");
app.set("views", "./views");
await connectDB();
app.engine(
  "hbs",
  engine({
    extname: "hbs",
    helpers: {
      fillHtmlContent: hbs_section()
    }
  })
);

app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: "SECRET_KEY",
    resave: false,
    saveUninitialized: true,
    cookie: {}
  })
);

import { Article } from "./Models/article.js";
import { User } from "./Models/user.js";

app.use(async function (req, res, next) {
  if (!req.session) {
    req.session.auth = false;
  }
  res.locals.auth = req.session.auth;
  res.locals.authUser = req.session.authUser;
  next();
});

const newest5Articles = await articleController.getTop5NewestArticles();
app.get("/", async function rootHandler(req, res) {
  const topViewedArticles =
    await articleController.getTop10MostViewedArticles();
  const newestArticles = await articleController.getTop10NewestArticles();
  const latestArticlesFromCategories =
    await articleController.getLatestArticleFromEachCategory();
  const popularArticles = await articleController.getPopularArticlesThisWeek();
  const articles = popularArticles.slice(0, 3);
  res.render("home", {
    article1: articles[0],
    article2: articles[1],
    article3: articles[2],
    topViewedArticles: topViewedArticles,
    newestArticles: newestArticles,
    latestArticlesFromCategories: latestArticlesFromCategories
  });
});

app.post("/login", async (req, res) => {
  const user = await User.findOne({ username: req.body.username }).lean();
  if (!user) {
    return res.render("login", {
      has_errors: "Username's invalid"
    });
  }

  if (!bcrypt.compareSync(req.body.password, user.password)) {
    return res.render("login", {
      has_errors: "Wrong password"
    });
  }

  req.session.auth = true;
  req.session.authUser = user;

  if (user.role === "administrator") {
    req.session.retUrl = "administrator";
  } else if (user.role === "writer") {
    req.session.retUrl = "writer";
  } else if (user.role === "editor") {
    req.session.retUrl = "editor";
  } else {
    req.session.retUrl = "/";
  }
  res.redirect(req.session.retUrl);
});

app.post("/logout", function (req, res) {
  req.session.auth = false;
  req.session.authUser = null;
  req.session.retUrl = null;
  req.session.role = null;
  res.redirect("/");
});

//Hàm để xử lý link youtube
function convertToEmbedUrls(urls) {
  if (urls.length === 0) return [];

  for (let y = 0; y < urls.length; y++) {
    let videoId = "";
    const str = urls[y]; // Lấy từng chuỗi
    for (let i = str.length - 1; i >= 0; i--) {
      if (str[i] === "=" || str[i] === "/") {
        videoId = str.slice(i + 1); // Lấy phần sau dấu '='
        break;
      }
    }
    urls[y] = "https://www.youtube.com/embed/" + videoId;
  }

  return urls;
}

app.get("/details", async function rootHandler(req, res) {
  const id = req.query.id || 0;
  const data = await articleController.getArticleById(id);
  if (!data) {
    return res.send("No data");
  }
  //Get 5 news same category
  const name = data.category.name || 0;
  const category = await categoryController.getCategoryByName(name);
  const articles = await Article.find({
    category: category._id,
    status: "published"
  })
    .limit(5)
    .lean();

  const embedUrls = convertToEmbedUrls(data.video_url); //Convert youtube link to embed link

  //Xử lý thêm 1 view
  await articleController.incrementView(id);

  res.render("details", {
    article: data,
    newest5Articles: articles,
    video_url: embedUrls
  });
});

app.post("/category", function (req, res) {
  const { catagoryName, catagoryDes } = req.body;
  const newcatagory = categoryController.createCategory(
    catagoryName,
    catagoryDes
  );
  res.redirect("/administrator");
});
app.post("/category/delete/:id", function (req, res) {
  categoryController.deleteCategory(req.params.id);
  res.redirect("/administrator");
});
app.post("/tag", async function (req, res) {
  const { tagName } = req.body;
  tagController.createTag(tagName);
  res.redirect("/administrator");
});
app.post("/tag/delete/:id", async function (req, res) {
  const id = req.params.id;
  tagController.deleteTag(id);
  res.redirect("/administrator");
});

app.get("/category", async function rootHandler(req, res) {
  const name = req.query.name || 0;
  const category = await categoryController.getCategoryByName(name);
  if (!category) {
    return res.send("Không có chuyên mục này");
  }

  const articles = await Article.find({
    category: category._id,
    status: "published"
  }).lean();
  res.render("list", {
    CategoryName: req.query.name,
    des: category.description,
    article: articles,
    newest5Articles: newest5Articles //Cho right-container
  });
});

app.post("/user", async (req, res) => {
  const userData = {
    username: req.body.username,
    password: req.body.userPass,
    email: req.body.userEmail,
    full_name: req.body.userFullName,
    role: req.body.userRole
  };
  const user = await userController.createUser(userData);
  res.redirect("/administrator");
});
app.post("/register", async function rootHandler(req, res) {
  try {
    const newUser = new User({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      full_name: req.body.full_name
    });
    if (!(newUser.password === req.body.confirm_password)) {
      res.send("Confirm password different from password");
      return;
    }
    console.log(newUser);

    const existUser = await User.findOne({ username: newUser.username }).lean();
    if (existUser) {
      res.send("Username already existed!");
      return;
    }

    const hashedPassword = await bcrypt.hash(newUser.password, 10);
    newUser.password = hashedPassword; //hash password

    await newUser.save();
    res.render("login", { message: "Register successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding new user");
  }
});
app.post("/user/delete/:id", async (req, res) => {
  const id = req.params.id;
  await userController.deleteUser(id);
  res.redirect("/administrator");
});
app.get("/login", function rootHandler(req, res) {
  res.render("login", {
    auth: req.session.auth
  });
});

app.get("/register", function rootHandler(req, res) {
  res.render("register");
});

app.post(
  "/administrator/editor/addcategory",
  isAuth,
  isAdmin,
  async (req, res) => {
    console.log(req.body.userid);
    const userId = req.body.userid;
    const categoryId = req.body.catagoryid;
    await userController.addAvailableCategory(userId, categoryId);
    res.redirect("/administrator");
  }
);

//////////// For writer
app.get("/writer/articles", isWriter, async function rootHandler(req, res) {
  const id = req.session.authUser._id || 0;
  const data = await articleController.getArticleByUser(id);
  if (!data) {
    return res.send("No data");
  }

  res.render("articleOfWriter", {
    article: data,
    usernamee: req.session.authUser.username
  });
});

app.get("/writer", isWriter, async function rootHandler(req, res) {
  const category = await categoryController.getAllCategories();
  res.render("writer", {
    category: category,
    tag: await tagController.getAllTags()
  });
});

app.post("/submit_article", isWriter, async (req, res) => {
  try {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
      image_url: req.body.image_url || [], // Nếu có file, lưu đường dẫn tệp vào image_url
      video_url: req.body.video_url || [], // Nếu có video_url, lưu nó
      premium: req.body.premium === "true", // Chuyển đổi thành boolean
      status: "pending",
      author: req.session.authUser._id, // ID người tạo bài viết/đăng nhập
      category: req.body.category,
      tags: req.body.tags || [], // Chuyển chuỗi tags thành mảng ID
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 0, // Mặc định là 0
      premium: req.body.premium
    });
    console.log(newArticle);
    // Lưu bài viết
    await newArticle.save();
    console.log(newArticle);
    res.send(
      '<script>alert("Article saved successfully"); window.location.href="/";</script>'
    );
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving article");
  }
});
///////////////
app.post("/article/approve", function (req, res) {
  const articleId = req.body.articleId;
  articleController.publishArticle(articleId);
  res.redirect("/editor");
});
app.post("/article/reject", function (req, res) {
  console.log(req.body);
  const articleId = req.body.articleIdReject;
  const note = req.body.rejectNote;
  articleController.rejectArticle(articleId, note);
  res.redirect("/editor");
});
app.get("/editor", isEditor, async function rootHandler(req, res) {
  const getPendingArticlesByUser = await articleController.getPendingArticles();
  res.render("editor", {
    getPendingArticlesByUser: getPendingArticlesByUser
  });
});

app.get("/about", function rootHandler(req, res) {
  res.render("about");
});

app.get("/subscribe", function rootHandler(req, res) {
  res.render("subscribe");
});

app.get("/administrator", isAuth, isAdmin, async function (req, res) {
  const allCategories = await categoryController.getAllCategories();
  const allTags = await tagController.getAllTags();
  const getPendingArticles = await articleController.getPendingArticles();
  const getAllUsers = await userController.getAllUsers();
  const getEditorsOnly = await userController.getEditorsOnly();
  const getAllCategories = await categoryController.getAllCategories();
  console.log(getEditorsOnly);

  res.render("administrator", {
    allCategory: allCategories,
    allTags: allTags,
    getPendingArticles: getPendingArticles,
    getAllUsers: getAllUsers,
    getEditorsOnly: getEditorsOnly,
    getAllCategories: getAllCategories
  });
});

app.get("/search", async (req, res) => {
  const query = req.query.q || ""; // Get the search query

  if (!query.trim()) {
    return res.render("list", {
      CategoryName: "Search Results",
      des: "No results found. Please try another query.",
      article: [],
      newest5Articles: await articleController.getTop5NewestArticles()
    });
  }

  try {
    // Find articles that match the query in title, abstract, or content
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

app.get("/latest", async (req, res) => {
  try {
    const articles = await articleController.getTop10NewestArticles();
    const newest5Articles = await articleController.getTop5NewestArticles(); // Right-side container data
    res.render("list", {
      CategoryName: "Latest News",
      des: "Browse the latest articles published.",
      article: articles,
      newest5Articles: newest5Articles
    });
  } catch (error) {
    console.error("Error loading latest articles:", error);
    res.status(500).send("Error loading latest articles");
  }
});

app.listen(3000, () => {
  console.log(`Server running on port http://localhost:3000/`);
});
