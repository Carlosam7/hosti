import type { Request, Response } from "express";
import { DBService } from "../services/db.service.js";
import { handleAxiosError } from "../utils/handleAxiosError.js";
import {
  BadRequestException,
  UnauthorizedException,
} from "../exceptions/http.exception.js";

export class DBController {
  private dbService = new DBService();

  getTable = async (req: Request, res: Response) => {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      throw new UnauthorizedException("Access token is missing");
    }

    const { tableName } = req.params;
    if (!tableName) {
      throw new BadRequestException("Table name param is required");
    }

    try {
      const data = await this.dbService.getTable(tableName, accessToken);
      return res.status(200).json(data);
    } catch (err) {
      console.log(err);
      return handleAxiosError(err, res);
    }
  };

  example = async (req: Request, res: Response) => {
    res.send("hello");
  };
}
