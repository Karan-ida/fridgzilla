// backend/src/routes/billRoutes.js
import express from "express";
import { createBill, getBills, deleteBill } from "../controllers/billController.js";
import {authenticate} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, createBill);
router.get("/", authenticate, getBills);
router.delete("/:id", authenticate, deleteBill);

export default router;
