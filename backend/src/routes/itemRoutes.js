// backend/src/routes/itemRoutes.js
import express from "express";
import { createItem, createBillItems, getItems, updateItem, deleteItem } from "../controllers/itemController.js";
import {authenticate} from "../middlewares/authMiddleware.js";

const router = express.Router();

// Manual entry
router.post("/manual", authenticate, createItem);

// Bill upload entry
router.post("/bill", authenticate, createBillItems);

// Fetch items (manual + bill)
router.get("/", authenticate, getItems);

// Update & delete
router.put("/:id", authenticate, updateItem);
router.delete("/:id", authenticate, deleteItem);

export default router;
