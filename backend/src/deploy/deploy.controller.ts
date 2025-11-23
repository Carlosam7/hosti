import type { NextFunction, Request, Response } from "express";
import { DeployManager } from "./deploy.manager.service.js";

export class DeployController {
  private readonly deployManager = new DeployManager();

  deploy = async (req: Request, res: Response, next: NextFunction) => {
    const dto = req.body;

    try {
      const url = await this.deployManager.handleDeploy(req, dto);
      return res.status(201).json({ message: "Deploy handled", url });
    } catch (err) {
      return next(err);
    }
  };
}
