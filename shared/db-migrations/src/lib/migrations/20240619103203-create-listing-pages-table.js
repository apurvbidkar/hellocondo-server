"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("listing_pages", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.fn("uuid_generate_v4"),
        primaryKey: true,
      },
      listing_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      building_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "buildings",
          key: "id",
        },
      },
      url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      feed_slug: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      unit_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      state: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      zip: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: true,
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

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("listing_pages");
  },
};
