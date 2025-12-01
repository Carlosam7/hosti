import type { Request, Response, NextFunction } from "express";
import { AuthModule } from "./auth.module.js";

const authManager = AuthModule.getInstance().authManager;
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await authManager.validateSession(req, res);
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
