import { DeployManagerService } from "./deploy.manager.service.js";
import { BadRequestException } from "../shared/exceptions/http.exception.js";
import type { NextFunction, Request, Response } from "express";
import type { CreateDeployDto } from "./dto/create-deploy.dto.js";
import type { SqliteDBService } from "../db/sqlite.db.service.js";

export class DeployController {
  constructor(
    private readonly deployManager: DeployManagerService,
    private readonly sqliteDBService: SqliteDBService
  ) {}

  deploy = async (req: Request, res: Response, next: NextFunction) => {
    const { accessToken } = req.cookies;
    // user viene del middleware de autenticacion.
    // siempre va a estar definido aqui.
    // si no estuviera definido, el middleware habria lanzado un error.
    const user = req.user;
    const dto = req.body as CreateDeployDto;

    try {
      const url = await this.deployManager.handleDeploy(
        accessToken,
        user!,
        dto
      );
      return res.status(201).json({ message: "Deploy handled", url });
    } catch (err) {
      return next(err);
    }
  };

  deleteDeploy = async (req: Request, res: Response, next: NextFunction) => {
    const { accessToken } = req.cookies;
    const { projectName } = req.params;
    const user = req.user;

    if (!projectName)
      throw new BadRequestException("Missing param 'projectName'");

    try {
      await this.deployManager.deleteDeploy(
        accessToken,
        projectName,
        user!.name
      );
      return res.status(200).json({ message: "Deploy deleted" });
    } catch (err) {
      return next(err);
    }
  };

  notifyAccess = async (req: Request, res: Response, next: NextFunction) => {
    // a este endpoint solo se accede internamente desde nginx
    // por lo que no es necesario autenticar al usuario
    const { project } = req.params;
    if (!project) throw new BadRequestException("Missing param 'project'");

    try {
      await this.deployManager.notifyAccess(project);
      return res.sendStatus(204);
    } catch (err) {
      return next(err);
    }
  };

  getDeploymentsByUserId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const user = req.user;

    try {
      const deployments = await this.sqliteDBService.findDeploymentByUserId(
        user!.uid
      );
      return res.status(200).json({ deployments });
    } catch (err) {
      return next(err);
    }
  };
}
