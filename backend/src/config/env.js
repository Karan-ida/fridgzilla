import dotenv from "dotenv";

dotenv.config();

const env = {
  port: process.env.PORT || 5000,
  dbUrl: process.env.DB_URL,
  jwtSecret: process.env.JWT_SECRET || "default_secret",
};

export default env;
