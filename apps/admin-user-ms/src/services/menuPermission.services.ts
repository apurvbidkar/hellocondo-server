// import { Transaction } from "sequelize";
import _ from "lodash";
import { db, models, sq } from "@condo-server/db-models";
import { SubPermission, UserPermissions } from "../types/permission.types.js";
import { UserMenuPermission } from "../viewModel/menuPermission.viewModel.js";
import { HttpError } from "../errors/index.js";
import { PermissionsArray } from "../types/permission.types.js";
import { RoleWithPermissions } from "../types/index.js";
/**
 * Fetches user permissions based on the provided userId.
 * @param userId - The ID of the user whose permissions are to be fetched.
 * @returns A Promise resolving to an array of objects representing user permissions.
 */
export async function getUserPermissions(userId: string): Promise<Array<UserPermissions>> {
  try {
    const permissions = (await db.menuPermissions.findAll({
      where: { userId },
      raw: true,
      nest: true,
      include: [{ model: db.menus, as: "menu" }],
      order: [[{ model: db.menus, as: "menu" }, "seqNo", "ASC"]],
    })) as unknown as UserMenuPermission[];

    const permissionsData: UserPermissions[] = [];

    for (const permission of permissions) {
      const menuData = {
        id: permission.id,
        menuId: permission.menu.id,
        section: permission.menu.name,
        displayName: permission.menu.displayName,
        isRead: permission.isRead,
        isWrite: permission.isWrite,
        isDelete: permission.isDelete,
        subPermissions: [],
      };
      if (permission.menu.type === "parent") {
        permissionsData.push(menuData);
      }
      if (permission.menu.type === "child") {
        const parentId = Math.floor(permission.menu.seqNo);
        permissionsData[parentId - 1].subPermissions.push(menuData);
      }
    }
    return permissionsData;
  } catch (error) {
    throw new HttpError(500, "Failed to fetch user permissions");
  }
}

/**
 * Creates or updates menu permissions for a user in the database.
 *
 * @param {Array<Omit<UserPermissions, "subPermissions">>} permissions - The array of menu permissions to create or update.
 * @param {string} userId - The ID of the user for whom the menu permissions are being created or updated.
 * @param {Transaction} transaction - The transaction object for database operations.
 * @throws {HttpError} Throws an HTTP error with status code 500 if the operation fails.
 */
export async function createUserMenuPermissions(
  permissions: Array<Omit<UserPermissions, "subPermissions">>,
  userId: string,
  transaction: sq.Transaction,
) {
  try {
    // Check if permissions array is not empty
    if (permissions.length > 0) {
      // Create an array of promises for each menu permission operation
      const promises = permissions.map((permission) =>
        db.menuPermissions.upsert(
          {
            userId: userId,
            menuId: permission?.menuId,
            isRead: permission?.isRead,
            isWrite: permission?.isWrite,
            isDelete: permission?.isDelete,
          },
          { transaction },
        ),
      );

      await Promise.all(promises);
    }
  } catch (error) {
    throw new HttpError(500, "Failed to create user menu permissions");
  }
}

/**
 * Updates the menu permissions for a user in bulk.
 *
 * @param {Array<Omit<UserPermissions, "subPermissions">>} permissions - An array of permission objects containing `menuId`, `isRead`, `isWrite`, and `isDelete` fields.
 * @param {string} userId - The ID of the user whose permissions are being updated.
 * @param {Transaction} transaction - The transaction object to ensure atomicity of the operation.
 *
 * @throws {HttpError} Throws an error if the update operation fails.
 */
export async function updateUserMenuPermissions(
  permissions: Array<Omit<UserPermissions, "subPermissions">>,
  userId: string,
  transaction: sq.Transaction,
) {
  try {
    // Check if permissions array is not empty
    if (permissions.length > 0) {
      // Create an array of promises for each menu permission operation
      const promises = permissions.map((permission) =>
        db.menuPermissions.update(
          {
            isRead: permission?.isRead,
            isWrite: permission?.isWrite,
            isDelete: permission?.isDelete,
          },
          { where: { userId, menuId: permission.menuId }, transaction },
        ),
      );

      await Promise.all(promises);
    }
  } catch (error) {
    throw new HttpError(500, "Failed to update user menu permissions");
  }
}

/**
 * Fetches all permissions from the database.
 *
 * @returns {Promise<Array<menus>>} A promise that resolves to an array of permissions.
 * @throws {HttpError} Throws an error if the fetch operation fails.
 */
export async function fetchPermissions(): Promise<Array<models.menus>> {
  try {
    const permissions = await db.menus.findAll({ raw: true });
    return permissions;
  } catch (error) {
    throw new HttpError(500, "Internal server error", error);
  }
}

/**
 * Transforms roles and permissions into a more readable format with nested sub-permissions.
 *
 * @param {userRoles[]} roles - The array of user roles.
 * @param {menus[]} permissions - The array of menus representing permissions.
 * @returns {Promise<Array<RoleWithPermissions>>} A promise that resolves to an array of roles with their formatted permissions.
 * @throws {HttpError} Throws an error if the transformation process fails.
 */
export async function prettifyPermissions(
  roles: models.userRoles[],
  permissions: models.menus[],
): Promise<Array<RoleWithPermissions>> {
  try {
    // TODO: Refactor this function to make it more readable
    const rolesData: Array<RoleWithPermissions> = [];
    for (const role of roles) {
      const defaultPermissions = role?.defaultPermission as PermissionsArray;

      const permissionsData: Array<UserPermissions> = [];
      for (const permission of defaultPermissions || []) {
        for (const [key] of Object.entries(permission)) {
          const permissionName = key;

          const menu = _.find(permissions, { name: _.snakeCase(permissionName) });
          const menuData: SubPermission = {
            menuId: menu?.id,
            section: menu?.name,
            displayName: menu?.displayName,
            isRead: permission[permissionName].isRead,
            isWrite: permission[permissionName].isWrite,
            isDelete: permission[permissionName].isDelete,
            subPermissions: [],
          };
          if (menu?.type === "parent") {
            permissionsData.push(menuData);
          }
          if (menu?.type === "child") {
            const parentId = Math.floor(menu?.seqNo);
            permissionsData[parentId - 1].subPermissions.push(menuData);
          }
        }
      }
      const permissionObject: RoleWithPermissions = {
        id: role?.id,
        roleName: role?.roleName,
        permissions: permissionsData,
      };
      rolesData.push(permissionObject);
    }

    return rolesData;
  } catch (error) {
    throw new HttpError(500, "Failed to prettify permissions", error);
  }
}
