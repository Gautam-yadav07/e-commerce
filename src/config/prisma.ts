import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";
import dotenv from 'dotenv';
dotenv.config();


const DB = process.env.DATABASE_URL;

if(!DB) {
  throw new Error("No DB Url Provided");
}

const adapter = new PrismaPg({ connectionString: DB });
const prisma = new PrismaClient({ adapter });

export default prisma;