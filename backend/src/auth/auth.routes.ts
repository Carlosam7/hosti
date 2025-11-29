import { Router } from "express";
import { AuthModule } from "./auth.module.js";

const router = Router();
const authModule = AuthModule.getInstance();
const authController = authModule.controller;

router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.post("/refresh", authController.refreshToken);
router.post("/logout", authController.logout);
router.get("/me", authController.authMe);

export default router;
