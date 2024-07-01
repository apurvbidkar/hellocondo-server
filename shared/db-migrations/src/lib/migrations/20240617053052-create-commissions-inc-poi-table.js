"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("commissions_inc_poi", {
      BusinessLocationID: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      BusinessName: {
        type: Sequelize.STRING(5000),
        allowNull: true,
      },
      Street: {
        type: Sequelize.STRING(5000),
        allowNull: true,
      },
      City: {
        type: Sequelize.STRING(5000),
        allowNull: true,
      },
      StateName: {
        type: Sequelize.STRING(5000),
        allowNull: true,
      },
      Zip: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      CountyName: {
        type: Sequelize.STRING(5000),
        allowNull: true,
      },
      Phone: {
        type: Sequelize.STRING(5000),
        allowNull: true,
      },
      StateCountyFIPS: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      Longitude: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      Latitude: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      GeoQualityCode: {
        type: Sequelize.STRING(5000),
        allowNull: true,
      },
      Category: {
        type: Sequelize.STRING(5000),
        allowNull: true,
      },
      LineOfBusiness: {
        type: Sequelize.STRING(5000),
        allowNull: true,
      },
      Industry: {
        type: Sequelize.STRING(5000),
        allowNull: true,
      },
      SIC1_4: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("commissions_inc_poi");
  },
};
