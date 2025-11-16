import { Router } from "express";
import dbRoutes from "../db/db.routes.js";
import authRoutes from "../auth/auth.routes.js";

const router = Router();

router.use("/db", dbRoutes);
router.use("/auth", authRoutes);

export default router;
