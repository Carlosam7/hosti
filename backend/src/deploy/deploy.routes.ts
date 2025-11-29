import { Router } from "express";
import { validate } from "../shared/middlewares/validate.middleware.js";
import { createDeployDto } from "./dto/create-deploy.dto.js";
import { DeployModule } from "./deploy.module.js";

const router = Router();
const deployModule = DeployModule.getInstance();
const deployController = deployModule.controller;

router.post("/", validate(createDeployDto, "body"), deployController.deploy);
router.delete("/:projectName", deployController.deleteDeploy);
router.patch("/notify-access/:projectName", deployController.notifyAccess);

export default router;
