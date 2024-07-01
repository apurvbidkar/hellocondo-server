"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      "menus",
      [
        {
          seq_no: 3,
          name: "manage_policies",
          display_name: "Manage Policies",
          type: "parent",
        },
        {
          seq_no: 4,
          name: "manage_amenities",
          display_name: "Manage Amenities",
          type: "parent",
        },
      ],
      {},
    );
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      DELETE FROM menus WHERE name IN ('manage_policies', 'manage_amenities');
    `);
  },
};
