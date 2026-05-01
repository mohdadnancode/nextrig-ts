import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductSuggestions,
  addProductImages,
  getProductMeta,
  deleteProductImage
} from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import upload from "../middleware/upload.js"

const router = express.Router();

router.get("/meta", getProductMeta);

// public
router.get("/suggestions", getProductSuggestions);
router.get("/", getProducts);
router.get("/:id", getProductById);

// admin
router.post("/", protect, adminOnly, upload.array("images", 6), createProduct);
router.put("/:id", protect, adminOnly, upload.array("images", 6), updateProduct);
router.put("/:id/images", protect, adminOnly, upload.array("images", 6), addProductImages)
router.patch("/:id/image", protect, adminOnly, deleteProductImage);
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;