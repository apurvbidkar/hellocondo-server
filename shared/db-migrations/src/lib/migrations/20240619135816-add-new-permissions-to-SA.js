"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Step 1: Identify Users who are Super Admins
    const superAdminUsers = await queryInterface.sequelize.query(
      `
      SELECT u.id
      FROM users u
      INNER JOIN user_roles ur ON u.role_id = ur.id
      WHERE ur.role_name = 'Super Admin';
    `,
      { type: Sequelize.QueryTypes.SELECT },
    );

    // Step 2: Find Permissions from Menus Table
    const permissionsQuery = `
      SELECT id, name
      FROM menus
      WHERE "name" IN ('manage_policies', 'manage_amenities')
    `;
    const permissions = await queryInterface.sequelize.query(permissionsQuery, { type: Sequelize.QueryTypes.SELECT });

    // Step 3: Insert New Permissions for Super Admin Users
    const newPermissions = superAdminUsers.flatMap((user) =>
      permissions.map((permission) => ({
        user_id: user.id,
        menu_id: permission.id,
        is_read: true,
        is_write: true,
        is_delete: true,
        created_at: new Date(),
      })),
    );

    await queryInterface.bulkInsert("menu_permissions", newPermissions, {});
  },

  down: async (queryInterface, Sequelize) => {
    const permissionsQuery = `SELECT id, name FROM menus WHERE "name" IN ('manage_policies', 'manage_amenities')`;
    const permissions = await queryInterface.sequelize.query(permissionsQuery, { type: Sequelize.QueryTypes.SELECT });

    const permissionIds = permissions.map((permission) => permission.id);

    await queryInterface.bulkDelete("menu_permissions", { menu_id: permissionIds });
  },
};
