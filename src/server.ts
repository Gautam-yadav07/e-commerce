import dotenv from 'dotenv';
import app from './app.js';
import { closeRabbitMQ, connectRabbitMQ } from './config/rabbitmq.js';
import { startEmailWorker } from './workers/email.worker.js';
import { connectRedis, redisClient, redisClose } from './config/redis.js';
import prisma from './config/prisma.js';

dotenv.config();

await connectRabbitMQ();
await startEmailWorker();
await connectRedis()
const PORT = process.env.PORT || 3000;

app.use("/", (req, res) => {
  res.status(200).send(`Response from ${PORT}`);
})

const server = app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`)
})


let shuttingDown = false;

const gracefulShutDown = (signal: string) => {

  console.log(`${signal} signal is  received`)

  if (shuttingDown) return;
  shuttingDown = true;

  console.log("Cleanup task")

  server.close(async () => {
    await closeRabbitMQ();

    await redisClose();

    await prisma.$disconnect();
    console.log("Database connection is closed")

    process.exit(0);
  })
}

process.on("SIGTERM", () => {
  gracefulShutDown("SIGTERM")
})

process.on("SIGINT", () => {
  gracefulShutDown("SIGINT")
})
