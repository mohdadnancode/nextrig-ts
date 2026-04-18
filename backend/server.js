import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

import connectDB from "./config/db.js";

import productRoutes from "./routes/productRoutes.js"

dotenv.config();

const app = express();

// connect database
connectDB();


// middleware
// app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);

// routes
app.get("/test-db", async (req, res) => {
    try {
        const collections = await mongoose.connection.db.listCollections().toArray();
        res.json({
            status: "connected",
            collections
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            error: error.message
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is runnnig on port ${PORT}`);
});