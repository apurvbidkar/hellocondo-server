"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("speakto_agent", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.fn("uuid_generate_v4"),
        primaryKey: true,
      },
      inquiry_type: {
        type: Sequelize.ENUM("Buying", "Selling", "Buying & Selling"),
        allowNull: true,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      address: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      name: {
        type: Sequelize.STRING(191),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      phone_number: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      property_type: {
        type: Sequelize.ENUM("Any", "Condo", "Townhouse"),
        allowNull: true,
      },
      target_price: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      additional_info: {
        type: Sequelize.TEXT,
        allowNull: true,
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
    await queryInterface.dropTable("speakto_agent");
  },
};
