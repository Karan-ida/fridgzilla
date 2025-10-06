import express from "express";
import { sendSMS } from "../controllers/smsController.js";

const router = express.Router();

// POST /sms  → send SMS manually
router.post("/sms", sendSMS);

export default router;
