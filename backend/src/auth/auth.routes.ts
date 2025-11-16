import { Router } from "express";
import { AuthController } from "./auth.controller.js";

const router = Router();
const authController = new AuthController();

router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.post("/refresh-token", authController.refreshToken);
router.post("/logout", authController.logout);
router.get("/me", authController.authMe);

export default router;
