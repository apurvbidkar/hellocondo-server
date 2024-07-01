"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("user_roles", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.fn("uuid_generate_v4"),
        primaryKey: true,
      },
      role_name: {
        type: Sequelize.STRING(44),
        allowNull: false,
      },
      is_admin: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: true,
      },
      default_permission: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    await queryInterface.addIndex("user_roles", ["id"], {
      name: "user_roles_pk",
      unique: true,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("user_roles");
  },
};
