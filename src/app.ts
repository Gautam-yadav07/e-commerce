import express from 'express';
import authRoutes from './routes/auth.route.js'
import { errorHandler } from './middlewares/error.middleware.js';
import cookieParser from 'cookie-parser'
import sellerRoutes from "./routes/seller.route.js"
import productRoutes from './routes/product.route.js'
import addressRoutes from './routes/address.route.js'
import cartRoutes from "./routes/cart.routes.js"
import orderRoutes from "./routes/order.route.js"
import paymentRoutes from "./routes/payment.route.js"


const app = express();

app.use(express.json());
app.use(cookieParser())

app.use("/health", (req, res)=>{
    res.status(200).send("OK");
})

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/sellers", sellerRoutes)
app.use("/api/v1/products",productRoutes);
app.use("/api/v1/addresses", addressRoutes)
app.use("/api/v1/carts", cartRoutes)
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/payments",paymentRoutes)

app.use(errorHandler);


export default app;