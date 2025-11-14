import { Router } from "express";
import { DBController } from "../controllers/db.controller.js";

const router = Router();
const dbController = new DBController();

router.get("/ex", dbController.example);
router.get("/:tableName", dbController.getTable);

export default router;
