import { Router } from "express";
import articleRoutes from "./articleRoutes.js";
import authRoutes from "./authRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import tagRoutes from "./tagRoutes.js";
import userRoutes from "./userRoutes.js";

const router = Router();

router.use("/", authRoutes);
router.use("/articles", articleRoutes);
router.use("/category", categoryRoutes);
router.use("/tag", tagRoutes);
router.use("/user", userRoutes);

export default router;
