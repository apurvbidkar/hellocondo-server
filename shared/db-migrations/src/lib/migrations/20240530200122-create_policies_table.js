"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("policies", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.fn("uuid_generate_v4"),
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      icon_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      sort_order: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      is_verified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      accuracy_percentage: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      color_codes: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      is_published: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      created_by: {
        type: Sequelize.STRING(255),
        allowNull: false,
        defaultValue: "Automation Script",
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_by: {
        type: Sequelize.STRING(255),
        allowNull: false,
        defaultValue: "Automation Script",
      },
    });

    await queryInterface.addIndex("policies", ["id"], {
      name: "policies_pk",
      unique: true,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("policies");
  },
};
