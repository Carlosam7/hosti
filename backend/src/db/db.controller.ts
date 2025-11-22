import type { Request, Response } from "express";
import { DBService } from "./db.service.js";

export class DBController {
  private readonly dbService = new DBService();

  getUser = async (req: Request, res: Response) => {
    const { accessToken } = req.cookies;
    const user = req.user;

    const userData = await this.dbService.getUser(accessToken, user!.uid);
    res.json(userData);
  };

  example = async (req: Request, res: Response) => {
    res.json({
      message: "DB Service is working!\nHello world!",
      timestamp: Date.now(),
    });
  };
}
