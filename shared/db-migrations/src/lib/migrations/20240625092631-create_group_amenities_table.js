"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("group_amenities", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.fn("uuid_generate_v4"),
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      display_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
        default: null,
      },
      icon: {
        type: Sequelize.STRING(255),
        allowNull: true,
        default: null,
      },
      sequence_order: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      created_by: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      },
      updated_by: {
        type: Sequelize.UUID,
        allowNull: true,
        defaultValue: null,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      },
      deleted_by: {
        type: Sequelize.UUID,
        allowNull: true,
        defaultValue: null,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("group_amenities");
  },
};
