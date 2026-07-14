
import { redisClient } from "../config/redis.js";


export const getCacheData = async (key: string) => {

  try {
    const data = await redisClient.get(key)
    if (!data) {
      return null
    }

    return JSON.parse(data)

  } catch (error) {
    console.log("Error getting data from redis", error)
  }

}


export const setCachedData = async (key: string, value: any, ttlSeconds: number = 3600) => {
  try {
    await redisClient.set(key, JSON.stringify(value))
    const data = JSON.stringify(value)
    await redisClient.setEx(key, ttlSeconds, data)

  } catch (error) {
    console.log("Error while storing data")
  }
}



export const deleteCachedData = async (key: string) => {
  try {
    await redisClient.del(key);
  } catch (error) {
    console.log("Error Deleting cached data")
  }
}
