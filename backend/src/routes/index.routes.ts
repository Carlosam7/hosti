import { Router } from "express";
import dbRoutes from "../db/db.routes.js";
import authRoutes from "../auth/auth.routes.js";
import deployRoutes from "../deploy/deploy.routes.js";
import { authMiddleware } from "../auth/auth.middleware.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/db", authMiddleware, dbRoutes);
router.use("/deploy", authMiddleware, deployRoutes);

export default router;
