import { Router } from "express";
import {
  register,
  login,
  logout,
  renderLogin,
  renderRegister
} from "../Controllers/auth.js";

const router = Router();

// middleware kiểm tra đã login
function redirectIfAuth(req, res, next) {
  if (req.session && req.session.auth) {
    return res.redirect("/"); // hoặc req.session.retUrl
  }
  next();
}

router.get("/login", redirectIfAuth, renderLogin);
router.post("/login", redirectIfAuth, login);

router.get("/register", redirectIfAuth, renderRegister);
router.post("/register", redirectIfAuth, register);

router.post("/logout", logout);

export default router;
