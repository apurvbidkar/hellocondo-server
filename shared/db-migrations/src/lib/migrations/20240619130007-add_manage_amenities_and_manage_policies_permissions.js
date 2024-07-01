"use strict";

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query(`
      update
	"user_roles"
set
	"default_permission" = jsonb_set(
    "default_permission",
	'{0}',
	("default_permission"->0 || '{"manageAmenities": {"isRead": true, "isWrite": true, "isDelete": true}, "managePolicies": {"isRead": true, "isWrite": true, "isDelete": true}}'::jsonb),
	true
)
where
	user_roles.role_name = 'Super Admin';
    `);
  },

  down: async (queryInterface, Sequelize) => {
    const superAdminRole = await queryInterface.sequelize.query(
      `SELECT * FROM "user_roles" WHERE role_name = 'Super Admin'`,
      { type: Sequelize.QueryTypes.SELECT },
    );

    if (superAdminRole.length > 0) {
      const updatedPermissions = superAdminRole[0].default_permission.map((permission) => {
        delete permission.manageAmenities;
        delete permission.managePolicies;
        return permission;
      });

      await queryInterface.sequelize.query(
        `UPDATE "user_roles" SET "default_permission" = :updatedPermissions WHERE role_name = 'Super Admin'`,
        { replacements: { updatedPermissions }, type: Sequelize.QueryTypes.UPDATE },
      );
    }
  },
};
