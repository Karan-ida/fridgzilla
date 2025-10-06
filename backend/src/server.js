// backend/src/server.js
import app from "./app.js";
import sequelize from "./config/db.js";
import env from "./config/env.js";
import "./scheduler/expiryNotification.js";

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");

    // Sync tables → alter:true only in development
    if (process.env.NODE_ENV === "development") {
      await sequelize.sync({ alter: true });
      console.log("🔧 Database synced with alter:true (development)");
    } else {
      await sequelize.sync();
      console.log("🚀 Database synced (production)");
    }

    app.listen(env.port, () => {
      console.log(`🌍 Server running on http://localhost:${env.port}`);
    });
  } catch (err) {
    console.error("❌ Server failed to start:", err);
  }
};

startServer();
