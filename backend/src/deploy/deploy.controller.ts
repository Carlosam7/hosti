import type { NextFunction, Request, Response } from "express";
import { DeployManager } from "./deploy.manager.service.js";

export class DeployController {
  private readonly deployManager = new DeployManager();

  deploy = async (req: Request, res: Response, next: NextFunction) => {
    const { repoUrl, subdomain } = req.body;

    try {
      await this.deployManager.handleDeploy(req, repoUrl, subdomain);
      return res.status(201).json({ message: "Deploy handled" });
    } catch (err) {
      return next(err);
    }
  };
}
