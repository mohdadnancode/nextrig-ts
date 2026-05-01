import express from "express";
import { createOrder, getUserOrders, cancelOrder, verifyPayment, createRazorpayOrder } from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.post("/create-razorpay-order", protect, createRazorpayOrder);
router.post("/verify-payment", protect, verifyPayment);
router.get("/my", protect, getUserOrders);
router.patch("/:id/cancel", protect, cancelOrder);

export default router;