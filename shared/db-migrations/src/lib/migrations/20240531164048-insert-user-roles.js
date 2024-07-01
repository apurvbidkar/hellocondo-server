"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const userRoles = [
      {
        role_name: "Super Admin",
        is_admin: true,
        default_permission: [
          {
            userManagement: {
              isRead: true,
              isWrite: true,
              isDelete: true,
            },
            manageBuildings: {
              isRead: true,
              isWrite: true,
              isDelete: true,
            },
            manageBuildingMedia: {
              isRead: true,
              isWrite: true,
              isDelete: true,
            },
            manageBuildingData: {
              isRead: true,
              isWrite: true,
              isDelete: true,
            },
          },
        ],
      },
      {
        role_name: "Admin",
        is_admin: true,
        default_permission: [
          {
            userManagement: {
              isRead: false,
              isWrite: false,
              isDelete: false,
            },
            manageBuildings: {
              isRead: true,
              isWrite: true,
              isDelete: false,
            },
            manageBuildingMedia: {
              isRead: true,
              isWrite: true,
              isDelete: false,
            },
            manageBuildingData: {
              isRead: true,
              isWrite: true,
              isDelete: false,
            },
          },
        ],
      },
      {
        role_name: "User",
        is_admin: false,
      },
    ];

    await queryInterface.bulkInsert(
      "user_roles",
      userRoles,
      {},
      {
        default_permission: {
          type: new Sequelize.JSONB(),
        },
      },
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("user_roles", null, {});
  },
};
