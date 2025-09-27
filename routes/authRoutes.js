import { Router } from "express";
import {
  register,
  login,
  logout,
  renderLogin,
  renderRegister,
  renderForgot,
  forgot,
  renderReset,
  resetPassword,
} from "../Controllers/auth.js";

const router = Router();

// Nếu đã login thì không vào login/register/forgot/reset
function redirectIfAuth(req, res, next) {
  if (req.session && req.session.auth) {
    return res.redirect("/");
  }
  next();
}

router.get("/login", redirectIfAuth, renderLogin);
router.post("/login", redirectIfAuth, login);

router.get("/register", redirectIfAuth, renderRegister);
router.post("/register", redirectIfAuth, register);

router.get("/forgot", redirectIfAuth, renderForgot);
router.post("/forgot", redirectIfAuth, forgot);

router.get("/reset/:token", redirectIfAuth, renderReset);
router.post("/reset/:token", redirectIfAuth, resetPassword);

router.post("/logout", logout);

export default router;
