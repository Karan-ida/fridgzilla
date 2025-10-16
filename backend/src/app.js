// backend/src/app.js
import express from "express";
import cors from "cors";

// ✅ Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import billRoutes from "./routes/billRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import passwordRoutes from "./routes/passwordRoutes.js";


// ✅ Middleware
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

// ✅ Global middlewares
app.use(cors());
app.use(express.json());

// ✅ Route mounting
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/users", userRoutes);
app.use("/password", passwordRoutes);

// ✅ Centralized error handler (must be last)
app.use(errorHandler);
// after app.use(express.json());
app.use("/uploads", express.static("uploads"));


export default app;
