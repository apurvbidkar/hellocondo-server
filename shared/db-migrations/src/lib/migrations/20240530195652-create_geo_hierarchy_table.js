"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("geo_hierarchy", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.fn("uuid_generate_v4"),
        primaryKey: true,
      },
      country: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      state_full: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      state: {
        type: Sequelize.STRING(255),
        allowNull: false,
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
      neighbourhood_l1: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      neighbourhood_l2: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      neighbourhood_l3: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      neighbourhood_l4: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
    });

    // Add the unique index
    await queryInterface.addIndex("geo_hierarchy", ["id"], {
      name: "geo_hierarchy_id",
      unique: true,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("geo_hierarchy");
  },
};
