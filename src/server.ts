import express from 'express';
import dotenv from 'dotenv';
import authRoutes from "./routes/user.route.js";
import { errorHandler } from './middlewares/error.middleware.js';

dotenv.config();

const app = express();

app.use(express.json());


app.use("/health", (req, res)=>{
  res.status(200).send("OK");
});

app.use("/api/v1/auth", authRoutes);

app.use(errorHandler)

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
  console.log(`Server is running on ${PORT}`)
})




