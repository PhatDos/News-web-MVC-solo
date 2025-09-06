import { Router } from "express";
import {
  register,
  login,
  logout,
  renderLogin,
  renderRegister
} from "../Controllers/auth.js";

const router = Router();

router.get("/login", renderLogin);
router.post("/login", login);

router.get("/register", renderRegister);
router.post("/register", register);

router.post("/logout", logout);

export default router;
