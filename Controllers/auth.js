import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import transporter from "../config/nodemailer.js";
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
      password: hashedPassword,
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

    if (user.role === "administrator") req.session.retUrl = "/administrator";
    else if (user.role === "writer") req.session.retUrl = "/writer";
    else if (user.role === "editor") req.session.retUrl = "/editor";
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

// [GET] /auth/forgot
export function renderForgot(req, res) {
  res.render("forgot");
}

// [POST] /auth/forgot
export async function forgot(req, res) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).lean();

    if (!user) {
      return res.render("forgot", { has_errors: "Email not found" });
    }

    // Tạo token reset (có hạn 5 phút)
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "5m" });

    // Lấy domain hiện tại từ request
    const baseUrl = req.protocol + "://" + req.get("host");
    const resetLink = `${baseUrl}/auth/reset/${token}`;

    // gửi email
    await transporter.sendMail({
      from: `"Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request(News web)",
      html: `
        <p>Hello ${user.full_name || "user"},</p>
        <p>Click the link below to reset your password (valid 5 minutes):</p>
        <a href="${resetLink}">${resetLink}</a>
      `,
    });

    return res.render("forgot", {
      message: "Reset link has been sent to your email.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error sending reset link");
  }
}

// [GET] /auth/reset/:token
export function renderReset(req, res) {
  const { token } = req.params;
  res.render("reset", { token });
}

// [POST] /auth/reset/:token
export async function resetPassword(req, res) {
  try {
    const { token } = req.params;
    const { password, confirm_password } = req.body;

    if (password !== confirm_password) {
      return res.render("reset", {
        has_errors: "Passwords do not match",
        token,
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.render("reset", { has_errors: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    return res.render("login", {
      message: "Password reset successful! Please log in.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error reset password");
  }
}
