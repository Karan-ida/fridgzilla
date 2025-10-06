// backend/src/models/User.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: { 
      type: DataTypes.STRING, 
      allowNull: false,
    },
    email: { 
      type: DataTypes.STRING, 
      allowNull: false, 
      unique: true,
      validate: {
        isEmail: true, // ✅ validates proper email format
      },
    },
    password: { 
      type: DataTypes.STRING, 
      allowNull: false, // ✅ password should not be null
    },
    phone: { 
      type: DataTypes.STRING, 
      allowNull: true, 
    },
    avatar: { 
      type: DataTypes.TEXT, // ✅ allows Base64 or URL
      allowNull: true, 
    },
  },
  {
    timestamps: true, // ✅ adds createdAt & updatedAt automatically
  }
);

export default User;
