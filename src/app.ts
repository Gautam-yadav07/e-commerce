import express from 'express';
import authRoutes from './routes/auth.route.js'
import { errorHandler } from './middlewares/error.middleware.js';
import cookieParser from 'cookie-parser'
import sellerRoutes from "./routes/seller.route.js"
import productRoutes from './routes/product.route.js'



const app = express();

app.use(express.json());
app.use(cookieParser())

app.use("/health", (req, res)=>{
    res.status(200).send("OK");
})

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/sellers", sellerRoutes)
app.use("/api/v1/products",productRoutes)

app.use(errorHandler);


export default app;