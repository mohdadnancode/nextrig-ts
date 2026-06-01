import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
// import cron from "node-cron";

import connectDB from "./config/db.js";
import { connectRedis } from "./config/redis.js";

import helmet from "helmet";
import hpp from "hpp";

import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

import errorHandler from "./middleware/errorMiddleware.js";


const app = express();
app.set("trust proxy", 1);

const normalizeOrigin = (origin) => origin?.replace(/\/$/, "");

const allowedOrigins = [
    "http://localhost:5173",
    ...(process.env.CLIENT_URL || "")
        .split(",")
        .map((origin) => normalizeOrigin(origin.trim()))
        .filter(Boolean),
];

const corsOptions = {
    origin: function (origin, callback) {

        if (!origin) {
            return callback(null, true);
        }

        if (allowedOrigins.includes(normalizeOrigin(origin))) {
            return callback(null, true);
        }

        return callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));

app.use(helmet());
app.use(hpp());

app.get("/api/health", (req, res) => {
    res.json({ ok: true });
});

// routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/admin", adminRoutes);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {

    try {
        await connectDB();
        console.log("MongoDB connected");

        await connectRedis();
        console.log("Redis connected");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (err) {
        console.error("Server startup failed:", err);
        process.exit(1);
    }
};

startServer();
