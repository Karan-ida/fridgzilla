// migrations/20250919-create-items.js
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("Items", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal("uuid_generate_v4()"),
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    purchaseDate: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    expiryDate: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    category: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    source: {
      type: Sequelize.ENUM("manual", "bill"),
      allowNull: false,
      defaultValue: "manual",
    },
    addedDate: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    userId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: { model: "Users", key: "id" },
      onDelete: "CASCADE",
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    updated_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("Items");
}
