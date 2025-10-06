// backend/src/routes/userRoutes.js
import express from "express";
import {authenticate} from "../middlewares/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// Protected route: Get user profile
router.get("/profile", authenticate, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "name", "email"],
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
