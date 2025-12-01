import { Router } from "express";
import authRoutes from "../auth/auth.routes.js";
import deployRoutes from "../deploy/deploy.routes.js";
import { hostMiddleware } from "../monitor/host.middleware.js";

const router = Router();

router.get("/", hostMiddleware);
router.use("/auth", authRoutes);
router.use("/deploy", deployRoutes);

export default router;
