// backend/src/routes/userRoutes.js
import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import { getProfile, updateProfile, updateAvatar } from "../controllers/userController.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.get("/profile", authenticate, getProfile);
router.put("/update", authenticate, updateProfile);
router.put("/avatar", authenticate, upload.single("avatar"), updateAvatar);

export default router;
