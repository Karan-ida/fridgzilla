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
app.use("/api/users", userRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/items", itemRoutes);
app.use("/password", passwordRoutes);

// ✅ Centralized error handler (must be last)
app.use(errorHandler);

export default app;
