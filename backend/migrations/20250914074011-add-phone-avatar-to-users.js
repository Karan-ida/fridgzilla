export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("Users", "phone", {
    type: Sequelize.STRING,
    allowNull: true,
  });
  await queryInterface.addColumn("Users", "avatar", {
    type: Sequelize.TEXT,
    allowNull: true,
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn("Users", "phone");
  await queryInterface.removeColumn("Users", "avatar");
}
