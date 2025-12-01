import type { Request, Response, NextFunction } from "express";
import { HttpException } from "../exceptions/http.exception.js";

export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof HttpException) {
    return res.status(err.status).json({
      error: err.error,
      message: err.message,
      details: err?.details,
    });
  }

  if (err.name === "CorsError") {
    return res.status(403).json({
      error: "CORST policy violation",
      message: err.message,
    });
  }

  console.error("UNHANDLED ERROR:", err);
  return res.status(500).json({
    error: "InternalServerError",
    message: "An unexpected error occurred",
  });
}
