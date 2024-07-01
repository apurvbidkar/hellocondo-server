"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("us_state_zip_codes", {
      state: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      metro: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      county: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      city: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      zip: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("us_state_zip_codes");
  },
};
