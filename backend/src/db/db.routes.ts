import { Router } from "express";
import { DBController } from "./db.controller.js";

const router = Router();
const dbController = new DBController();

router.get("/test", dbController.getUser);
router.get("/hello", dbController.example);

export default router;
