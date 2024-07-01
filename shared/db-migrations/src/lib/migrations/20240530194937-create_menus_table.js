"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("menus", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.fn("uuid_generate_v4"),
        primaryKey: true,
      },
      seq_no: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      display_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM("parent", "child"),
        allowNull: false,
      },
      child_of: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "menus",
          key: "id",
        },
      },
    });

    await queryInterface.addIndex("menus", ["id"], {
      name: "menus_pk",
      unique: true,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("menus");
  },
};
