import dotenv from 'dotenv';
import app from './app.js';
import { connectRabbitMQ } from './config/rabbitmq.js';
import { startEmailWorker } from './workers/email.worker.js';
import { connectRedis } from './config/redis.js';

dotenv.config();

await connectRabbitMQ();
await startEmailWorker();
await connectRedis()
const PORT = process.env.PORT || 3000;

app.use("/", (req, res) => {
  res.status(200).send(`Response from ${PORT}`);
})

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`)
})




