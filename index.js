import express from "express";
import session from "express-session";
import { engine } from "express-handlebars";
import hbs_section from "express-handlebars-sections";
import dotenv from "dotenv";
import { connectDB } from "./utils/db.js";
import routes from "./routes/index.js";

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

// 🔑 Middleware global
app.use((req, res, next) => {
  res.locals.auth = req.session.auth || false;
  res.locals.authUser = req.session.authUser || null;
  next();
});

// DB connect
await connectDB();

// Routes
app.use("/", routes);

// Start server
app.listen(3000, () => {
  console.log("✅ Server running on http://localhost:3000");
});
