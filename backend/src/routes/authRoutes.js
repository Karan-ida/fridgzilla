// backend/src/routes/authRoutes.js
import express from "express";
import {
  register,
  login,
  updateProfile,
} from "../controllers/authController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.put("/update", authenticate, updateProfile);

// Get logged-in user details (for testing auth)
router.get("/me", authenticate, (req, res) => {
  res.status(200).json({ message: "Authenticated user", user: req.user });
});

export default router;
