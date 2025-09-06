// routes/staticRoutes.js
import express from "express";

const router = express.Router();

router.get("/about", (req, res) => {
  res.render("about");
});

router.get("/nhingu", (req, res) => {
  res.render("nhingu");
});

export default router;
