import type{ Request, Response, NextFunction } from "express";
import { redisClient } from "../config/redis.js";
import { handleErrorResponse } from "../utils/handleErrorResponse.js";

interface FixedWindowOptions {
  prefix: string;
  limit: number;
  windowInSeconds: number;
}

export const fixedWindowLimiter = ({
  prefix,
  limit,
  windowInSeconds,
}: FixedWindowOptions) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
        
      const key = `${prefix}:${req.ip}`;

      const requestCount = await redisClient.incr(key);

      if (requestCount === 1) {
        await redisClient.expire(key, windowInSeconds)
      }

      if (requestCount > limit) {
        return handleErrorResponse(res, 429, "Too many requests. Please try again later")
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};