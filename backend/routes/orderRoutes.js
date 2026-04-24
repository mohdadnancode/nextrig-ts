import express from "express";
import { createOrder, getUserOrders, cancelOrder } from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/my", protect, getUserOrders);
router.patch("/:id/cancel", protect, cancelOrder);

export default router;