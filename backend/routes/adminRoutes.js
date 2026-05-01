import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import {
    getDashboardStats,
    getAllOrders,
    updateOrderStatus,
    getAllUsers,
    toggleBlockUser,
} from "../controllers/adminController.js";

const router = express.Router();

router.use(protect, adminOnly);

// Dashboard
router.get("/dashboard", getDashboardStats);

// Orders
router.get("/orders", getAllOrders);
router.patch("/orders/:id/status", updateOrderStatus);

// Users
router.get("/users", getAllUsers);
router.patch("/users/:id/block", toggleBlockUser);

export default router;