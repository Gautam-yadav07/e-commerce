import type{ Request, Response, NextFunction } from "express";
import { redisClient } from "../config/redis.js";
import { handleErrorResponse } from "../utils/handleErrorResponse.js";

interface TokenBucketOptions {
  prefix: string;
  capacity: number;         
  refillRate: number;        
  refillInterval: number;    
}

export const tokenBucketLimiter = ({
  prefix,
  capacity,
  refillRate,
  refillInterval,
}: TokenBucketOptions) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {

      const identifier = req.user?.id ?? req.ip;

      const key = `${prefix}:${identifier}`;

      const data = await redisClient.get(key);

      let bucket = data ? JSON.parse(data): {
            tokens: capacity,
            lastRefill: Date.now(),
          };

      const now = Date.now();

      const timeDiffrence = now - bucket.lastRefill;

      const refillTokens = Math.floor(timeDiffrence / (refillInterval * 1000)) * refillRate;

      if (refillTokens > 0) {

        bucket.tokens = Math.min(
          capacity,
          bucket.tokens + refillTokens
        );

        bucket.lastRefill = now;
      }

      if (bucket.tokens <= 0) {
        return handleErrorResponse(res, 429, "Too many request. Please try again later.")
      }

      bucket.tokens--;

      await redisClient.set(key, JSON.stringify(bucket), {
            EX: refillInterval * capacity
        });

      next();

    } catch (error) {

      next(error);

    }
  };
};