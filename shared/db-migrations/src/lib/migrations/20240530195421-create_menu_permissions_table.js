"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("menu_permissions", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.fn("uuid_generate_v4"),
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      menu_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "menus",
          key: "id",
        },
      },
      is_read: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      is_write: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      is_delete: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
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
    });

    await queryInterface.addIndex("menu_permissions", ["id"], {
      name: "menu_permissions_pk",
      unique: true,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("menu_permissions");
  },
};
