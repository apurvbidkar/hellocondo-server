"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("ahref_volume_kd", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.fn("uuid_generate_v4"),
        primaryKey: true,
        unique: "ahref_volume_kd_unique",
      },
      slug: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      data: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      sum_volume: {
        type: Sequelize.BIGINT,
        allowNull: true,
      },
      sum_kd: {
        type: Sequelize.BIGINT,
        allowNull: true,
      },
      aggregate_kd: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      date_imported: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.addIndex("ahref_volume_kd", ["id"], {
      name: "ahref_volume_kd_unique",
      unique: true,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("ahref_volume_kd");
  },
};
