import { Router } from "express";
import { userController } from "../Controllers/user.js";
import { isAuth, isAdmin } from "../middlewares/auth.js";

const router = Router();

// Đăng ký
router.post("/register", async (req, res) => {
  try {
    const { username, password, email } = req.body;
    await userController.register(username, password, email);
    res.redirect("/login");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error registering user");
  }
});

// Đăng nhập
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await userController.login(username, password);

    if (!user) {
      return res.send("Sai tài khoản hoặc mật khẩu");
    }

    req.session.authUser = user;
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error logging in");
  }
});

// Đăng xuất
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

// Quản lý người dùng (admin)
router.get("/manage", isAuth, isAdmin, async (req, res) => {
  try {
    const users = await userController.getAllUsers();
    res.render("manageUsers", { users });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading users");
  }
});

// Xoá user (admin)
router.post("/delete/:id", isAuth, isAdmin, async (req, res) => {
  try {
    await userController.deleteUser(req.params.id);
    res.redirect("/user/manage");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting user");
  }
});

export default router;
