import { Router } from "express";
import { DeployController } from "./deploy.controller.js";
import { validate } from "../shared/middlewares/validate.middleware.js";
import { CreateDeployDto } from "./dto/create-deploy.dto.js";

const router = Router();
const deployController = new DeployController();

router.post("/", validate(CreateDeployDto, "body"), deployController.deploy);

export default router;
