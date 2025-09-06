import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../Models/user.js";

const JWT_SECRET = process.env.JWT_SECRET || "SECRET_KEY";

// [POST] /auth/register
export async function register(req, res) {
  try {
    const { username, password, confirm_password, email, full_name } = req.body;

    if (password !== confirm_password) {
      return res.status(400).send("Confirm password different from password");
    }

    const existUser = await User.findOne({ username }).lean();
    if (existUser) {
      return res.status(400).send("Username already existed!");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      full_name,
      password: hashedPassword
    });

    await newUser.save();
    res.render("login", { message: "Register successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error registering user");
  }
}

// [POST] /auth/login
export async function login(req, res) {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username }).lean();
    if (!user) {
      return res.render("login", { has_errors: "Username's invalid" });
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return res.render("login", { has_errors: "Wrong password" });
    }

    // Lưu session
    req.session.auth = true;
    req.session.authUser = user;

    if (user.role === "administrator") req.session.retUrl = "administrator";
    else if (user.role === "writer") req.session.retUrl = "writer";
    else if (user.role === "editor") req.session.retUrl = "editor";
    else req.session.retUrl = "/";

    res.redirect(req.session.retUrl);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error login");
  }
}

// [POST] /auth/logout
export async function logout(req, res) {
  req.session.auth = false;
  req.session.authUser = null;
  req.session.retUrl = null;
  req.session.role = null;
  res.redirect("/");
}

// [GET] /auth/login
export function renderLogin(req, res) {
  res.render("login", { auth: req.session.auth });
}

// [GET] /auth/register
export function renderRegister(req, res) {
  res.render("register");
}
