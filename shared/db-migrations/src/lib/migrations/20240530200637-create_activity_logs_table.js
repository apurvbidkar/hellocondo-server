"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("activity_logs", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.fn("uuid_generate_v4"),
        primaryKey: true,
        unique: true,
      },
      activity_time: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      details: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      ip_address: {
        type: Sequelize.INET,
        allowNull: true,
      },
      user_agent: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      action_reference: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      actor_type: {
        type: Sequelize.ENUM("admin", "user", "moderator", "super_admin"),
        allowNull: false,
      },
      action_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "app_user_action_types",
          key: "id",
        },
      },
      module_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "app_module_types",
          key: "id",
        },
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("activity_logs");
  },
};
