import { Router } from "express";
import { validate } from "../shared/middlewares/validate.middleware.js";
import { createDeployDto } from "./dto/create-deploy.dto.js";
import { DeployModule } from "./deploy.module.js";
import { authMiddleware } from "../auth/auth.middleware.js";

const router = Router();
const deployModule = DeployModule.getInstance();
const deployController = deployModule.controller;

router.post(
  "/",
  validate(createDeployDto, "body"),
  authMiddleware,
  deployController.deploy
);
router.delete("/:projectName", authMiddleware, deployController.deleteDeploy);
router.get("/notify-access/:project", deployController.notifyAccess);
router.get(
  "/user/deployments",
  authMiddleware,
  deployController.getDeploymentsByUserId
);

export default router;
