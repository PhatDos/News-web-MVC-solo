import { Router } from "express";

// Import tất cả routes
import homeRoutes from "./homeRoutes.js";
import staticRoutes from "./staticRoutes.js";
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
import newsRoutes from "./newsRoutes.js";

const router = Router();

// Route ưu tiên chung
router.use("/", homeRoutes);
router.use("/", staticRoutes);

// Route theo chức năng
router.use("/auth", authRoutes);
router.use("/category", categoryRoutes);
router.use("/article", articleRoutes);
router.use("/tag", tagRoutes);
router.use("/user", userRoutes);
router.use("/writer", writerRoutes);
router.use("/search", searchRoutes);
router.use("/latest", latestRoutes);

// Route admin/editor/news riêng
router.use("/admin", adminRoutes);
router.use("/editor", editorRoutes);
router.use("/news", newsRoutes);

export default router;
