"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("buildings", {
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
      geo_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "geo_hierarchy",
          key: "id",
        },
      },
      address: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      building_slug: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      zip: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      house_number: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      unit_number: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      street_number: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      street_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      street_direction: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      street_suffix: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      lat: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },
      long: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },
      year_built: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      no_of_units: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      no_of_stories: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      hoa_fees: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      new_construction: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      waterfront: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      view: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      units_for_sale: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      unit_ids: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      average_psf: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      unit_size_range: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      summary: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      access_type: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      policies: {
        type: Sequelize.ARRAY(Sequelize.UUID),
        allowNull: true,
      },
      amenities: {
        type: Sequelize.ARRAY(Sequelize.UUID),
        allowNull: true,
      },
      sales_report: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      historical_avg_price_psf: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      historical_avg_hoa_fees_psf: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      faq: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      about_property: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      has_media_attachments: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      review_needed: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      created_by: {
        type: Sequelize.UUID,
        allowNull: true,
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
      updated_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      deleted_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("buildings");
  },
};
