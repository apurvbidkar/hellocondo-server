"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("building_media", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.fn("uuid_generate_v4"),
        primaryKey: true,
      },
      b_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "buildings",
          key: "id",
        },
      },
      images: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      videos: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      video_tour_url: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      created_by: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_by: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("building_media");
  },
};
