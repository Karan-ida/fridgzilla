import express from "express";
import cors from "cors";

// routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import billRoutes from "./routes/billRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import itemRoutes from "./routes/itemRoutes.js"; // ✅ added
import testRoutes from "./routes/testRoutes.js";
// middlewares
import errorHandler from "./middlewares/errorHandler.js"; // ✅ centralized error handler

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// route mounting
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/items", itemRoutes); // ✅ item endpoints
app.use("/api", testRoutes);
// error handling middleware (must come last)
app.use(errorHandler);

export default app;
