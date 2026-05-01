import express from "express";
import {
  registerUser,
  verifyOTP,
  resendOTP,
  loginUser,
  logoutUser,
  getMe,
  refreshToken,
  updateUser,
  removeProfileImage,
} from "../controllers/authController.js";
import {
  addAddress,
  updateAddress,
  deleteAddress,
  setPrimaryAddress,
} from "../controllers/addressController.js";
import { authLimiter } from "../middleware/rateLimiter.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Auth
router.post("/refresh-token", refreshToken);
router.post("/register", authLimiter, registerUser);
router.post("/verify-otp", authLimiter, verifyOTP);
router.post("/resend-otp", authLimiter, resendOTP);
router.post("/login", authLimiter, loginUser);
router.post("/logout", logoutUser);
router.get("/me", protect, getMe);
router.patch("/:id", protect, upload.single("image"), updateUser);
router.delete("/:id/profile-image", protect, removeProfileImage)

// Addresses
router.post("/address", protect, addAddress);
router.put("/address/:id", protect, updateAddress);
router.delete("/address/:id", protect, deleteAddress);
router.patch("/address/:id/primary", protect, setPrimaryAddress);

router.get("/check-username/:username", async (req, res) => {
  const username = req.params.username.toLocaleLowerCase();
  const reserved = ["admin", "root", "owner", "system"];

  if (reserved.includes(username)) {
    return res.json({ available: false, reason: "reserved" });
  }

  const exists = await User.findOne({ username: req.params.username });
  res.json({ available: !exists });
});

export default router;