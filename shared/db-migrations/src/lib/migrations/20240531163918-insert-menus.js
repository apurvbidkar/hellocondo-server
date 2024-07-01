"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      "menus",
      [
        {
          seq_no: 1,
          name: "user_management",
          display_name: "User Management",
          type: "parent",
        },
        {
          seq_no: 2,
          name: "manage_buildings",
          display_name: "Manage Buildings",
          type: "parent",
        },
        {
          seq_no: 2.1,
          name: "manage_building_media",
          display_name: "Manage Media",
          type: "child",
        },
        {
          seq_no: 2.2,
          name: "manage_building_data",
          display_name: "Manage Buildings Data",
          type: "child",
        },
      ],
      {},
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("menus", {
      name: ["user_management", "manage_buildings", "manage_building_media", "manage_building_data"],
    });
  },
};
