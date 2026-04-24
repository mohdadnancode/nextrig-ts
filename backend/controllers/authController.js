import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateTokens } from "../utils/tokenGenerator.js";
import { getRedisClient } from "../config/redis.js";
import { generateOTP } from "../utils/otpGenerator.js";
import { sendOTPEmail } from "../utils/sendEmail.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";
import cloudinary from "../config/cloudinary.js";


// REFRESH TOKEN
export const refreshToken = (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "No refresh token" });

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_KEY);
    const newAccessToken = jwt.sign(
      { id: decoded.id, email: decoded.email, role: decoded.role },
      process.env.ACCESS_TOKEN_KEY,
      { expiresIn: "15m" }
    );
    res.json({ accessToken: newAccessToken });
  } catch {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
};

// Register
export const registerUser = async (req, res) => {
  let createdUser = null;
  try {
    const redis = getRedisClient();
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      if (!userExists.isVerified) {
        const otp = generateOTP();
        await redis.set(`otp:${email}`, otp, { EX: 300 });
        await sendOTPEmail(email, otp);
        return res.status(200).json({ message: "OTP resent to email", email });
      }
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    createdUser = await User.create({
      username, email, password: hashedPassword, isVerified: false,
    });

    const otp = generateOTP();
    await redis.set(`otp:${email}`, otp, { EX: 300 });
    await sendOTPEmail(email, otp);

    return res.status(201).json({ message: "OTP sent to email", email });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    if (createdUser) {
      try { await User.findByIdAndDelete(createdUser._id); } catch { }
    }
    if (err.code === "EAUTH") {
      return res.status(500).json({ message: "Email service configuration error." });
    }
    res.status(500).json({ message: err.message });
  }
};

// Verify OTP
export const verifyOTP = async (req, res) => {
  const redis = getRedisClient();
  const { email, otp } = req.body;
  try {
    const attemptsKey = `otp:attempts:${email}`;
    const attempts = await redis.get(attemptsKey);
    if (attempts && Number(attempts) >= 5) {
      return res.status(429).json({ message: "Too many attempts. Try again later." });
    }

    const storedOtp = await redis.get(`otp:${email}`);
    if (!storedOtp) return res.status(400).json({ message: "OTP expired" });

    if (storedOtp !== otp) {
      await redis.incr(attemptsKey);
      await redis.expire(attemptsKey, 300);
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const user = await User.findOne({ email });
    user.isVerified = true;
    await user.save();

    await redis.del(`otp:${email}`);
    await redis.del(attemptsKey);

    const { accessToken, refreshToken } = generateTokens(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ message: "Email verified successfully", accessToken });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Resend OTP
export const resendOTP = async (req, res) => {
  const redis = getRedisClient();
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    if (user.isVerified) return res.status(400).json({ message: "User already verified" });

    const cooldownKey = `otp:cooldown:${email}`;
    if (await redis.get(cooldownKey)) {
      return res.status(429).json({ message: "Please wait before requesting another OTP" });
    }

    const otp = generateOTP();
    await redis.set(`otp:${email}`, otp, { EX: 300 });
    await redis.set(cooldownKey, "1", { EX: 60 });
    await sendOTPEmail(email, otp);

    res.json({ message: "OTP resent successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    if (!user.isVerified) return res.status(401).json({ message: "Please verify your email first" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const { accessToken, refreshToken } = generateTokens(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ _id: user._id, username: user.username, email: user.email, accessToken });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Logout
export const logoutUser = (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.json({ message: "Logged out" });
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user._id.toString() !== id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updates = {};

    // Username — check for duplicates excluding self
    if (req.body.username) {
      const existing = await User.findOne({ username: req.body.username, _id: { $ne: id } });
      if (existing) return res.status(400).json({ message: "Username already taken" });
      updates.username = req.body.username;
    }

    // Email — check for duplicates excluding self
    if (req.body.email) {
      const existing = await User.findOne({ email: req.body.email, _id: { $ne: id } });
      if (existing) return res.status(400).json({ message: "Email already in use" });
      updates.email = req.body.email;
    }

    if (req.body.currentPassword && req.body.newPassword) {
      const user = await User.findById(id);
      if (!user) return res.status(404).json({ message: "User not found" });

      const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
      if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

      if (req.body.newPassword.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }

      updates.password = await bcrypt.hash(req.body.newPassword, 10);
    }

    if (req.body.addresses !== undefined) {
      updates.addresses =
        typeof req.body.addresses === "string"
          ? JSON.parse(req.body.addresses)
          : req.body.addresses;
    }

    if (req.body.cart !== undefined) {
      updates.cart = req.body.cart.map((item) => ({
        product: item._id,
        quantity: item.quantity,
      }));
    }

    if (req.body.wishlist !== undefined) {
      updates.wishlist = req.body.wishlist.map((item) =>
        typeof item === "string" ? item : item._id
      );
    }

    // Profile image upload to Cloudinary
    if (req.file) {
      const user = await User.findById(id);

      // Delete old image from Cloudinary
      if (user?.profileImage?.public_id) {
        try {
          await cloudinary.uploader.destroy(user.profileImage.public_id);
        } catch (err) {
          console.warn("Failed to delete old Cloudinary image:", err.message);
        }
      }

      const result = await uploadToCloudinary(req.file.buffer, "nextrig/users");
      updates.profileImage = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.json(updatedUser);
  } catch (err) {
    console.error("UPDATE USER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// GET ME
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate("cart.product", "name price images countInStock category")
      .populate("wishlist", "name price images countInStock category");

    if (!user) return res.status(404).json({ message: "User not found" });

    const cart = user.cart
      .filter((item) => item.product)
      .map((item) => ({
        _id: item.product._id,
        name: item.product.name,
        price: item.product.price,
        image: item.product.images?.[0] ?? "",
        stock: item.product.countInStock,
        category: item.product.category,
        quantity: item.quantity,
      }));

    res.json({ ...user.toObject(), cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};