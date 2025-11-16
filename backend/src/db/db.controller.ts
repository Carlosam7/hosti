import type { Request, Response } from "express";
import { DBService } from "./db.service.js";

export class DBController {
  private dbService = new DBService();

  // TODO:
  // Check user info
  // Save user's repositories info to DB

  async example(req: Request, res: Response) {
    res.json({
      message: "DB Service is working!\nHello world!",
      timestamp: Date.now(),
    });
  }
}
