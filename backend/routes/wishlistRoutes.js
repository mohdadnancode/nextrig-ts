import express from "express";
import {
    getWishlist,
    toggleWishlist,
    clearWishlist,
} from "../controllers/wishlistController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getWishlist);
router.post("/toggle", protect, toggleWishlist);
router.delete("/clear", protect, clearWishlist);

export default router;