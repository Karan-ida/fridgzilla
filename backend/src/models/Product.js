// src/models/Product.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";

const Product = sequelize.define("Product", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expiryDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  isNotified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, // ✅ ensures we don’t send duplicate reminders
  },
});

export default Product;
