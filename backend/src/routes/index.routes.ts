import { Router } from "express";
import exampleRoutes from "./example.routes.js";

const router = Router();

router.use("/example", exampleRoutes);

export default router;
