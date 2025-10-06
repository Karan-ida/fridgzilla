// backend/src/config/db.js
import { Sequelize } from "sequelize";
import env from "./env.js";

const sequelize = new Sequelize(env.dbUrl, {
  dialect: "postgres",
  logging: false, // change to console.log if you want query logs
});

export default sequelize;
