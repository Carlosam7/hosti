import axios from "axios";
import type { Response } from "express";

export function handleAxiosError(err: unknown, res: Response) {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status || 500;
    const statusText = err.response?.statusText || "Internal Server Error";
    const message =
      err.response?.data?.message || "An unexpected error occurred";

    return res.status(status).json({
      error: statusText,
      message,
    });
  }
  return res.status(500).json({
    error: "Internal Server Error",
    message: "An unexpected error occurred",
  });
}
