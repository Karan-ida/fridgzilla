// backend/src/server.js
import app from "./app.js";
import sequelize from "./config/db.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // sync models with DB
    console.log("Database connected successfully");

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Server failed:", err);
  }
};

startServer();
