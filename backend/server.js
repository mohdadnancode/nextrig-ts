import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import { connectRedis } from "./config/redis.js";

import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import cron from "node-cron";
import { autoCancelUnpaidOrders } from "./controllers/orderController.js";


const app = express();

app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true,
    })
);

app.use(cookieParser());
app.use(express.json());

cron.schedule("*/5 * * * *", () => {
    autoCancelUnpaidOrders();
});

// routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {

    try {
        await connectDB();
        await connectRedis();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error("Server failed to start", err);
        process.exit(1);
    }
};

startServer();