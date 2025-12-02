import type { Request, Response, NextFunction } from "express";

type Bucket = { count: number; resetTime: number };
const buckets = new Map<string, Bucket>();

const REQUEST_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_MINUTE = 100;

export function rateLimit(req: Request, res: Response, next: NextFunction) {
  const key = `${req.ip}:${req.headers.host ?? ""}`;
  const now = Date.now();

  let bucket = buckets.get(key);
  if (!bucket || now > bucket.resetTime) {
    bucket = { count: 0, resetTime: now + REQUEST_WINDOW_MS };
    buckets.set(key, bucket);
    return next();
  }

  bucket.count++;

  const remainingRequests = Math.max(0, MAX_REQUESTS_PER_MINUTE - bucket.count);
  res.setHeader("X-RateLimit-Limit", String(MAX_REQUESTS_PER_MINUTE));
  res.setHeader("X-RateLimit-Remaining", String(remainingRequests));
  res.setHeader(
    "X-RateLimit-Reset",
    String(Math.ceil((bucket.resetTime - now) / 1000))
  );

  if (bucket.count > MAX_REQUESTS_PER_MINUTE) {
    res.status(429).json({
      error: "TooManyRequests",
      message: "Rate limit exceeded. Please try again later.",
      retryAfter: Math.ceil((bucket.resetTime - now) / 1000),
    });
  }

  next();
}
