"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Step 1: Get the role_id for 'Super Admin'
    const [superAdminRole] = await queryInterface.sequelize.query(
      `SELECT id FROM user_roles WHERE role_name = 'Super Admin'`,
      { type: Sequelize.QueryTypes.SELECT },
    );

    if (!superAdminRole) {
      throw new Error("Super Admin role not found in user_roles table.");
    }

    // User data will be changed for next environment
    // User cant login to the system without iam_id from cognito
    const roleId = superAdminRole.id;

    const superAdmins = [
      {
        id: "24f45079-d17e-423f-addf-617c3d7efac8",
        iam_id: process.env.SUPER_ADMIN_1_IAM_ID || null,
        name: process.env.SUPER_ADMIN_1_NAME || "John Doe", // for Bayan
        email: process.env.SUPER_ADMIN_1_EMAIL || "john.doe@example.com",
      },
      {
        id: "6eca8763-2231-4f7d-9d68-e20de2d4c51c",
        iam_id: process.env.SUPER_ADMIN_2_IAM_ID || null,
        name: process.env.SUPER_ADMIN_2_NAME || "Jane Doe", // for Adam
        email: process.env.SUPER_ADMIN_2_EMAIL || "janedoe@example.com",
      },
    ];

    for (const admin of superAdmins) {
      // Step 2: Check if the user exists
      const [existingUser] = await queryInterface.sequelize.query(
        `SELECT id FROM users WHERE email = '${admin.email}'`,
        { type: Sequelize.QueryTypes.SELECT },
      );

      // Step 3: Insert the user if not found
      if (!existingUser) {
        await queryInterface.bulkInsert(
          "users",
          [
            {
              id: admin.id,
              iam_id: admin.iam_id, // This will be updated later
              name: admin.name,
              email: admin.email,
              role_id: roleId,
              phone_number: null,
              email_verified: false,
              phone_verified: false,
              is_active: true,
              created_at: new Date(),
              updated_at: new Date(),
              created_by: admin.id,
              updated_by: admin.id,
            },
          ],
          {},
        );

        // Step 4: Fetch menu IDs for specified menu names
        const menuNames = ["user_management", "manage_buildings", "manage_building_media", "manage_building_data"];

        const menus = await queryInterface.sequelize.query(
          `SELECT id, "name" FROM menus WHERE "name" IN (:menuNames)`,
          { replacements: { menuNames }, type: Sequelize.QueryTypes.SELECT },
        );

        // Step 5: Prepare menu permissions data
        const currentDate = new Date();

        let menuPermissionsData = [];
        for (let i = 0; i < menus.length; i++) {
          const menu = menus[i];
          menuPermissionsData.push({
            user_id: admin.id,
            menu_id: menu.id,
            is_read: true,
            is_write: true,
            is_delete: false,
            created_at: currentDate,
            updated_at: currentDate,
          });
        }
        // Step 6: Insert or update menu permissions
        await queryInterface.bulkInsert("menu_permissions", menuPermissionsData, {});
      }
    }
  },

  down: async () => {
    // This down migration is not needed as it's a new user creation
  },
};
