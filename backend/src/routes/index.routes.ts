import { Router } from "express";
import authRoutes from "../auth/auth.routes.js";
import deployRoutes from "../deploy/deploy.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/deploy", deployRoutes);

export default router;
