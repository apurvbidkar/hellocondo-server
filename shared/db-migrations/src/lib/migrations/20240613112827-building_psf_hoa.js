"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("building_psf_hoa", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.fn("uuid_generate_v4"),
        primaryKey: true,
      },
      building_id: {
        type: Sequelize.UUID,
        allowNull: false
      },
      listing_details: {
        type: Sequelize.JSON,
        allowNull: true
      },
      average_psf: {
        type: Sequelize.JSON,
        allowNull: true
      },
      average_hoa: {
        type: Sequelize.JSON,
        allowNull: true
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("building_psf_hoa");
  },
};
