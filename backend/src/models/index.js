import User from "./User.js";
import Product from "./Product.js";

// Define associations
User.hasMany(Product, { as: "products", foreignKey: "userId", onDelete: "CASCADE" });
Product.belongsTo(User, { as: "user", foreignKey: "userId" });

export { User, Product };
