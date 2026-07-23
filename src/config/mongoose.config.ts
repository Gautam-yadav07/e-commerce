import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { AppError } from '../utils/appError.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new AppError(400, "MONGO_URI is not configured")
}

export const mongooseConnection = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Mongo DB connected successfully");
  } catch (error) {
    console.log("Error while connecting Mongo db")
    process.exit(1)
  }
}

export const disconnectMongoose = async () => {
  await mongoose.disconnect();
  console.log("Database is disconnected")
}






