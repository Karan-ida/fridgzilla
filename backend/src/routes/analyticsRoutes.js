// backend/src/routes/analyticsRoutes.js
import express from "express";
import { getAnalytics } from "../controllers/analyticsController.js";
import {authenticate} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authenticate, getAnalytics);

export default router;
