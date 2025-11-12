import { Router } from "express";
import {
  exampleController,
  helloWorld,
} from "../controllers/example.controller.js";

const router = Router();

router.get("/", helloWorld);
router.get("/:msg", exampleController);

export default router;
