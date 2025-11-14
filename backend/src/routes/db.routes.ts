import { Router } from "express";
import { DBController } from "../controllers/db.controller.js";

const router = Router();
const dbController = new DBController();

router.get("/:tableName", dbController.getTable);
router.get("/ex", dbController.example);

export default router;
