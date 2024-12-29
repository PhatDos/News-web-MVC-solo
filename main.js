import express from "express";
import { engine } from "express-handlebars";
import { connectDB } from "./utils/db.js";
import { login } from "./Controllers/auth.js";
import { middleware } from "./middleware/middleware.js";

import bcrypt from "bcryptjs";

import { articleController } from "./Controllers/article.js";
import { categoryController } from "./Controllers/category.js";
import { tagController } from "./Controllers/tag.js";
import { userController } from "./Controllers/user.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));
app.use(cookieParser());

app.engine("hbs", engine({}));
app.set("view engine", "hbs");
app.set("views", "./views");
await connectDB();
app.engine(
  "hbs",
  engine({
    extname: "hbs"
  })
);

// app.use(async function (req, res, next) {
//   if (req.session.true === undefined) {
//     req.session.auth = false;
//   }
//   res.locals.auth = req.session.auth;
//   res.locals.username = req.username;
//   next();
// });

// async function seedUsers() {
//   try {
//     const users = [
//       {
//         username: "guest_user",
//         password: "password123",
//         email: "guest@example.com",
//         full_name: "Guest User",
//         role: "guest",
//       },
//       {
//         username: "subscriber_user",
//         password: "password123",
//         email: "subscriber@example.com",
//         full_name: "Subscriber User",
//         role: "subscriber",
//         subscription_expiration: new Date(
//           Date.now() + 30 * 24 * 60 * 60 * 1000
//         ), // 30 ngày từ bây giờ
//       },
//       {
//         username: "writer_user",
//         password: "password123",
//         email: "writer@example.com",
//         full_name: "Writer User",
//         pen_name: "Author123",
//         role: "writer",
//       },
//       {
//         username: "editor_user",
//         password: "password123",
//         email: "editor@example.com",
//         full_name: "Editor User",
//         role: "editor",
//       },
//       {
//         username: "admin_user",
//         password: "password123",
//         email: "admin@example.com",
//         full_name: "Administrator User",
//         role: "administrator",
//       },
//     ];

//     for (const user of users) {
//       const hashedPassword = await bcrypt.hash(user.password, 10); // Mã hóa mật khẩu
//       user.password = hashedPassword;
//       await User.create(user);
//     }

//     console.log("Seeded users successfully");
//   } catch (error) {
//     console.error("Error seeding users:", error);
//   }
// }

// await seedUsers();

// import { Category } from "./Models/category.js";
// import { Tag } from "./Models/tag.js";
import { Article } from "./Models/article.js";
import { Category } from "./Models/category.js";
import { Tag } from "./Models/tag.js";
import { User } from "./Models/user.js";

// const createCategories = async () => {
//   const categories = [
//     { name: "Technology", description: "Latest tech trends and news" },
//     { name: "Health", description: "Health tips and wellness articles" },
//     { name: "Sports", description: "Sports news and updates" },
//     { name: "Lifestyle", description: "Lifestyle trends and tips" },
//     { name: "Business", description: "Business news and entrepreneurship" },
//     { name: "Entertainment", description: "Movies, music, and pop culture" },
//     { name: "Education", description: "Educational content and resources" },
//     { name: "Travel", description: "Travel guides and tips" },
//     { name: "Food", description: "Food trends, recipes, and nutrition" },
//     { name: "Science", description: "Science news and discoveries" },
//     { name: "Art", description: "Art and creativity" },
//   ];

//   const categoryDocuments = await Category.insertMany(categories);
//   return categoryDocuments;
// };

// const createTags = async () => {
//   const tags = [
//     { name: "AI" },
//     { name: "Fitness" },
//     { name: "Football" },
//     { name: "Tech" },
//     { name: "Nutrition" },
//     { name: "Basketball" },
//     { name: "Wearables" },
//     { name: "Training" },
//     { name: "Smartphones" },
//     { name: "Workout" },
//     { name: "Fashion" },
//     { name: "Marketing" },
//     { name: "Movies" },
//     { name: "Music" },
//     { name: "Entrepreneurship" },
//     { name: "Travel Tips" },
//     { name: "Food Trends" },
//     { name: "Nutrition Facts" },
//     { name: "Discoveries" },
//     { name: "Creativity" },
//   ];

//   const tagDocuments = await Tag.insertMany(tags);
//   return tagDocuments;
// };

// const createArticles = async (categories, tags) => {
//   const articlesData = [];

//   // Define specific tags for each category
//   const categoryTags = {
//     Technology: [tags[0], tags[3], tags[8]],
//     Health: [tags[1], tags[4], tags[7]],
//     Sports: [tags[2], tags[5], tags[6]],
//     Lifestyle: [tags[10], tags[9], tags[3]],
//     Business: [tags[11], tags[12], tags[15]],
//     Entertainment: [tags[13], tags[14], tags[9]],
//     Education: [tags[18], tags[7], tags[3]],
//     Travel: [tags[16], tags[14], tags[17]],
//     Food: [tags[18], tags[4], tags[19]],
//     Science: [tags[0], tags[6], tags[19]],
//     Art: [tags[18], tags[7], tags[6]],
//   };

//   // Define image URLs for each category
//   const categoryImages = {
//     Technology: [
//       "https://via.placeholder.com/600x300?text=Technology+1",
//       "https://via.placeholder.com/600x300?text=Technology+2",
//     ],
//     Health: [
//       "https://via.placeholder.com/600x300?text=Health+1",
//       "https://via.placeholder.com/600x300?text=Health+2",
//     ],
//     Sports: [
//       "https://via.placeholder.com/600x300?text=Sports+1",
//       "https://via.placeholder.com/600x300?text=Sports+2",
//     ],
//     Lifestyle: [
//       "https://via.placeholder.com/600x300?text=Lifestyle+1",
//       "https://via.placeholder.com/600x300?text=Lifestyle+2",
//     ],
//     Business: [
//       "https://via.placeholder.com/600x300?text=Business+1",
//       "https://via.placeholder.com/600x300?text=Business+2",
//     ],
//     Entertainment: [
//       "https://via.placeholder.com/600x300?text=Entertainment+1",
//       "https://via.placeholder.com/600x300?text=Entertainment+2",
//     ],
//     Education: [
//       "https://via.placeholder.com/600x300?text=Education+1",
//       "https://via.placeholder.com/600x300?text=Education+2",
//     ],
//     Travel: [
//       "https://via.placeholder.com/600x300?text=Travel+1",
//       "https://via.placeholder.com/600x300?text=Travel+2",
//     ],
//     Food: [
//       "https://via.placeholder.com/600x300?text=Food+1",
//       "https://via.placeholder.com/600x300?text=Food+2",
//     ],
//     Science: [
//       "https://via.placeholder.com/600x300?text=Science+1",
//       "https://via.placeholder.com/600x300?text=Science+2",
//     ],
//     Art: [
//       "https://via.placeholder.com/600x300?text=Art+1",
//       "https://via.placeholder.com/600x300?text=Art+2",
//     ],
//   };

//   // Define videos for each category
//   const categoryVideos = {
//     Technology: [
//       "https://www.youtube.com/embed/dQw4w9WgXcQ",
//       "https://www.youtube.com/embed/3JZ_D3ELwOQ",
//     ],
//     Health: ["https://www.youtube.com/embed/hY2PqU5y8P0"],
//     Sports: ["https://www.youtube.com/embed/ktvTqknDobU"],
//     Lifestyle: ["https://www.youtube.com/embed/lX4CVNjmrEY"],
//     Business: ["https://www.youtube.com/embed/5nGJqXBbP7M"],
//     Entertainment: ["https://www.youtube.com/embed/tVZEdgKmUt4"],
//     Education: ["https://www.youtube.com/embed/LZYjF7m3NXY"],
//     Travel: ["https://www.youtube.com/embed/8eudtJbYtmQ"],
//     Food: ["https://www.youtube.com/embed/Y8k78a6XG0g"],
//     Science: ["https://www.youtube.com/embed/0lGJgR9TBBw"],
//     Art: ["https://www.youtube.com/embed/hO9vdrGe9RU"],
//   };

//   for (let category of categories) {
//     const articleCount = Math.floor(Math.random() * 3) + 10; // 10-12 articles per category
//     for (let i = 0; i < articleCount; i++) {
//       const specificTags = categoryTags[category.name];
//       const images = categoryImages[category.name];
//       const videos = categoryVideos[category.name];

//       // Create HTML content with embedded images and videos
//       const articleContent = `
//         <h1>Article ${category.name} ${i + 1}</h1>
//         <p>This is a sample content for the ${
//           category.name
//         } article. It includes images and videos:</p>
//         <div>
//           <h2>Images:</h2>
//           <img src="${images[i % images.length]}" alt="Image for ${
//         category.name
//       } article ${i + 1}" width="100%" />
//         </div>
//         <div>
//           <h2>Video:</h2>
//           <iframe width="560" height="315" src="${
//             videos[i % videos.length]
//           }" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
//         </div>
//       `;

//       const article = {
//         title: `Article ${category.name} ${i + 1}`,
//         content: articleContent,
//         category: category._id,
//         tags: specificTags.map((tag) => tag._id),
//         image_url: [images[i % images.length]], // Cycle through available images
//         video_url: [videos[i % videos.length]], // Cycle through available videos
//         status: "published",
//         author: "6768f1f9ea0ac66458f56601", // Replace with actual user ID
//       };
//       articlesData.push(article);
//     }
//   }

//   const articles = await Article.insertMany(articlesData);
//   return articles;
// };

// const seedDatabase = async () => {
//   try {
//     const categories = await createCategories();
//     const tags = await createTags();
//     const articles = await createArticles(categories, tags);
//   } catch (error) {
//     console.error("Error seeding database:", error);
//   }
// };

// seedDatabase();
const newest5Articles = await articleController.getTop5NewestArticles();
app.get("/", async function rootHandler(req, res) {
  const popularArticles = await articleController.getPopularArticlesThisWeek();
  const topViewedArticles =
    await articleController.getTop10MostViewedArticles();
  const newestArticles = await articleController.getTop10NewestArticles();
  const latestArticlesFromCategories =
    await articleController.getLatestArticleFromEachCategory();
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
  console.log(req.body);
  const { username, password } = req.body;
  try {
    const result = await login(username, password);
    if (result.status !== 200) {
      return res.status(result.status).json({ message: result.message });
    }

    const { role, token } = result;

    // Gửi token qua cookie
    res.cookie("token", token, {
      httpOnly: true, // For security, ensures JavaScript cannot access the cookie
      secure: process.env.NODE_ENV === "production", // Ensure cookie is secure in production
      maxAge: 3600000 // 1 hour
    });

    if (role === "administrator") {
      return res.redirect("/administrator");
    } else if (role === "writer") {
      return res.redirect("/writer");
    } else if (role === "editor") {
      return res.redirect("/editor");
    } else {
      return res.redirect("/");
    }
  } catch (err) {
    res.status(500).json({ err: err });
  }
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

  const embedUrls = convertToEmbedUrls(data.video_url);

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
    const existUser = await User.find({ username: newUser.username }).lean();
    if (existUser) {
      res.send("Username already existed!");
      return;
    }

    const hashedPassword = await bcrypt.hash(newUser.password, 10);
    newUser.password = hashedPassword; //hash password

    console.log(newUser);
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
  res.render("login");
});

app.get("/register", function rootHandler(req, res) {
  res.render("register");
});

app.post("/administrator/editor/addcategory", async (req, res) => {
  console.log(req.body.userid);
  const userId = req.body.userid;
  const categoryId = req.body.catagoryid;
  await userController.addAvailableCategory(userId, categoryId);
  res.redirect("/administrator");
});

//////////// For writer
app.get(
  "/writer/articles",
  middleware.verifyRole(["writer"]),
  async function rootHandler(req, res) {
    const id = req.userId || 0;
    const data = await articleController.getArticleByUser(id);
    if (!data) {
      return res.send("No data");
    }

    res.render("articleOfWriter", {
      article: data,
      usernamee: req.username
    });
  }
);

app.get("/writer", async function rootHandler(req, res) {
  const category = await categoryController.getAllCategories();
  res.render("writer", {
    category: category,
    tag: await tagController.getAllTags()
  });
});

app.post(
  "/submit_article",
  middleware.verifyRole(["writer", "administrator"]),
  async (req, res) => {
    try {
      const newArticle = new Article({
        title: req.body.title,
        content: req.body.content,
        image_url: req.body.image_url || [], // Nếu có file, lưu đường dẫn tệp vào image_url
        video_url: req.body.video_url || [], // Nếu có video_url, lưu nó
        premium: req.body.premium === "true", // Chuyển đổi thành boolean
        status: "pending",
        author: req.userId, // ID người tạo bài viết/đăng nhập
        category: req.body.category,
        tags: req.body.tags || [], // Chuyển chuỗi tags thành mảng ID
        createdAt: new Date(),
        updatedAt: new Date(),
        views: 0, // Mặc định là 0
        premium: req.body.premium
      });
      // Lưu bài viết
      await newArticle.save();
      console.log(newArticle);
      res.send("Article saved successfully");
    } catch (err) {
      console.error(err);
      res.status(500).send("Error saving article");
    }
  }
);
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
app.get(
  "/editor",
  middleware.verifyRole(["editor", "administrator"]),
  async function rootHandler(req, res) {
    const getPendingArticlesByUser =
      await articleController.getPendingArticlesByUser(req.userId);
    console.log("User's username:", req.userId);
    res.render("editor", {
      getPendingArticlesByUser: getPendingArticlesByUser
    });
  }
);

app.get("/about", function rootHandler(req, res) {
  res.render("about");
});

app.get("/subscribe", function rootHandler(req, res) {
  res.render("subscribe");
});

app.get("/administrator", async function (req, res) {
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

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
