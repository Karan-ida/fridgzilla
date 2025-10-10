import express from "express"; // <- required for express.static
import path from "path";
import app from "./app.js";
import sequelize from "./config/db.js";
import env from "./config/env.js";
import "./models/index.js"; // register associations
import "./scheduler/expiryNotification.js"; // start SMS scheduler

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

    // Serve uploads folder
    app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

    // Root route
    app.get("/", (req, res) => res.send("Backend running successfully 🚀"));

    // Log all registered routes
    if (app && app._router) {
      console.log(
        "Routes registered:",
        app._router.stack
          .filter((r) => r.route)
          .map((r) => r.route.path)
      );
    }

    app.listen(env.port, () => {
      console.log(`🌍 Server running on http://localhost:${env.port}`);
    });
  } catch (err) {
    console.error("❌ Server failed to start:", err);
  }
};

startServer();
