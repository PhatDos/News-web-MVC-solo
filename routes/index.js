import { Router } from "express";

// Import tất cả routes
import homeRoutes from "./homeRoutes.js";
import authRoutes from "./authRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import articleRoutes from "./articleRoutes.js";
import tagRoutes from "./tagRoutes.js";
import userRoutes from "./userRoutes.js";
import writerRoutes from "./writerRoutes.js";
import searchRoutes from "./searchRoutes.js";
import latestRoutes from "./latestRoutes.js";
import adminRoutes from "./adminRoutes.js";
import editorRoutes from "./editorRoutes.js";

const router = Router();

router.use("/", homeRoutes);
router.use("/auth", authRoutes);
router.use("/category", categoryRoutes);
router.use("/article", articleRoutes);
router.use("/user", userRoutes);
router.use("/writer", writerRoutes);
router.use("/search", searchRoutes);
router.use("/latest", latestRoutes);

// Route admin/editor/news riêng
router.use("/tag", tagRoutes);
router.use("/administrator", adminRoutes);
router.use("/editor", editorRoutes);

export default router;
