// backend/src/server.js
import express from "express";
import app from "./app.js";
import sequelize from "./config/db.js";
import env from "./config/env.js";
import "./scheduler/expiryNotification.js";
import path from "path";

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");

    if (process.env.NODE_ENV === "development") {
      await sequelize.sync({ alter: true });
      console.log("🔧 Database synced with alter:true (development)");
    } else {
      await sequelize.sync();
      console.log("🚀 Database synced (production)");
    }

    // ✅ Serve uploaded files publicly
    app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

    // ✅ Root test route (optional)
    app.get("/", (req, res) => {
      res.send("Backend running successfully 🚀");
    });

    // ✅ Start server
    app.listen(env.port, () => {
      console.log(`🌍 Server running on http://localhost:${env.port}`);
    });
  } catch (err) {
    console.error("❌ Server failed to start:", err);
  }
};

startServer();
