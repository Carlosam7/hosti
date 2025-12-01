import type { NextFunction, Request, Response } from "express";
import { SqliteDBService } from "../db/sqlite.db.service.js";
import { DeployModule } from "../deploy/deploy.module.js";

export const hostMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const host = req.headers.host;
  if (!host) {
    return res.status(400).send("Host header is missing");
  }
  console.log(`Incoming request from host: ${host}`);

  if (req.path !== "/") return next();

  const hostParts = host.split(".");
  if (hostParts.length < 3) return next();

  const subdomain = hostParts.slice(0, 2).join(".");

  try {
    const deploy =
      await SqliteDBService.getInstance().findDeployment(subdomain);
    if (!deploy) return res.status(404).end();

    if (deploy.active) return next();

    console.log(`Waking up host ${subdomain}`);

    const deployManager = DeployModule.getDeployManager();
    deployManager
      .wakeUp(subdomain)
      .then(() => deployManager.notifyAccess(subdomain))
      .then(() => console.log(`Host ${subdomain} is now active.`));

    return res.status(412).end();
  } catch (err) {
    return next(err);
  }
};
