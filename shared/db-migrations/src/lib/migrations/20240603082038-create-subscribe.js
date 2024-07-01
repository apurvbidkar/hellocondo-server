"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("subscribe", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.fn("uuid_generate_v4"),
        primaryKey: true,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      is_subscribe: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: true,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("subscribe");
  },
};
