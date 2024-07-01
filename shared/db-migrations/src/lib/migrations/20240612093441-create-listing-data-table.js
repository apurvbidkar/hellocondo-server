"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("listings_data", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.fn("uuid_generate_v4"),
        primaryKey: true,
      },
      listing_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      building_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "buildings",
          key: "id",
        },
      },
      listing_psf: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      listing_living_area: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      listing_price: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      days_on_market: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      total_parking: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      bedrooms: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      bathrooms: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      similar_listing_details: {
        type: Sequelize.ARRAY(Sequelize.JSONB),
        allowNull: true,
      },
      closed_listings_details: {
        type: Sequelize.ARRAY(Sequelize.JSONB),
        allowNull: true,
      },
      psf_for_similar_listings: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      psf_diff_similar_listings: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      psf_percent_difference_similar_listings: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      listing_price_difference_similar_listings: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      listing_price_difference_percent_similar_listings: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      psf_for_closed_listings: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      psf_diff_for_closed_listings: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      psf_percent_difference_closed_listings: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("listings_data");
  },
};
