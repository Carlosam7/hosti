import type { Request, Response, NextFunction } from "express";
import { ZodError, ZodType } from "zod";
import { BadRequestException } from "../exceptions/http.exception.js";

export function validate(schema: ZodType, source: "body" | "query" | "params") {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req[source]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (req as any)[source] = parsed;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return next(
          new BadRequestException("Invalid request data", err.issues)
        );
      }
      return next(err);
    }
  };
}
