import type { Request, Response, NextFunction } from "express";
import { AuthManager } from "./auth.manager.service.js";

const authManager = new AuthManager();
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
