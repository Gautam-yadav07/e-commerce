import express from 'express';
import authRoutes from './routes/user.route.js'
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();

app.use(express.json());

app.use("/health", (req, res)=>{
    res.status(200).send("OK");
})

app.use("/api/v1/auth", authRoutes);

app.use(errorHandler);


export default app;