import { Router } from "express";
import dbRoutes from "./db.routes.js";
import authRoutes from "./auth.routes.js";

const router = Router();

router.use("/db", dbRoutes);
router.use("/auth", authRoutes);

export default router;
