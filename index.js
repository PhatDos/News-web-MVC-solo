import express from "express";
import session from "express-session";
import { engine } from "express-handlebars";
import hbs_section from "express-handlebars-sections";
import dotenv from "dotenv";
import { connectDB } from "./utils/db.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// View engine
app.engine(
  "hbs",
  engine({
    extname: "hbs",
    helpers: { section: hbs_section() }
  })
);
app.set("view engine", "hbs");
app.set("views", "./views");

// Session
app.set("trust proxy", 1);
app.use(
  session({
    secret: process.env.SESSION_SECRET || "SECRET_KEY",
    resave: false,
    saveUninitialized: true,
    cookie: {}
  })
);

// 🔑 Middleware global để đưa auth vào tất cả view
app.use((req, res, next) => {
  res.locals.auth = req.session.auth || false;
  res.locals.authUser = req.session.authUser || null;
  next();
});

// DB connect
await connectDB();

// Routes
import homeRoutes from "./routes/homeRoutes.js";
import staticRoutes from "./routes/staticRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import articleRoutes from "./routes/articleRoutes.js";
import tagRoutes from "./routes/tagRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import writerRoutes from "./routes/writerRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import editorRoutes from "./routes/editorRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";
import latestRoutes from "./routes/latestRoutes.js";

//Route ưu tiên chung
app.use("/", homeRoutes);
app.use("/", staticRoutes);

//Route theo chức năng
app.use("/auth", authRoutes);
app.use("/category", categoryRoutes);
app.use("/article", articleRoutes);
app.use("/tag", tagRoutes);
app.use("/user", userRoutes);
app.use("/writer", writerRoutes);
app.use("/search", searchRoutes);
app.use("/latest", latestRoutes);

//Route admin/editor/news riêng
app.use("/admin", adminRoutes);
app.use("/editor", editorRoutes);
app.use("/news", newsRoutes);

// Start server
app.listen(3000, () => {
  console.log(`✅ Server running on http://localhost:3000`);
});
