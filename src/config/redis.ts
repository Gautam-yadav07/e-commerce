import { createClient } from "redis";

const REDIS_URL = process.env.REDIS_URL
if (!REDIS_URL) {
  throw new Error("REDIS URL is not configured");
}


export const redisClient = createClient({
  url: REDIS_URL
})


redisClient.on('connect', () => console.log("Redis Client Connected"))

redisClient.on('error', (err) => console.log("Redis Client error", err))

export const connectRedis = async (): Promise<void> => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}