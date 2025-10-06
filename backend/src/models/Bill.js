// backend/src/models/Bill.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";

const Bill = sequelize.define(
  "Bill",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Title cannot be empty" },
      },
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        isFloat: { msg: "Amount must be a number" },
        min: { args: [0], msg: "Amount must be greater than or equal to 0" },
      },
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users", // table name Sequelize generates for User
        key: "id",
      },
    },
  },
  {
    timestamps: true,
    underscored: true,
  }
);

// Associations
User.hasMany(Bill, { foreignKey: "userId", onDelete: "CASCADE" });
Bill.belongsTo(User, { foreignKey: "userId" });

export default Bill;
