// backend/src/routes/authRoutes.js
import express from "express";
import {
  register,
  login,
  updateProfile,
  updateAvatar, // ✅ import new controller
} from "../controllers/authController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 🟢 Public routes
router.post("/register", register);
router.post("/login", login);

// 🔒 Protected routes
router.put("/update", authenticate, updateProfile);

// ✅ New route to update user avatar
router.put("/avatar", authenticate, updateAvatar);

// 🧩 For verifying logged-in user
router.get("/me", authenticate, (req, res) => {
  res.status(200).json({ message: "Authenticated user", user: req.user });
});

export default router;
