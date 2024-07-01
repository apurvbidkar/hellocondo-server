import { db,models } from "@condo-server/db-models";
import { HttpError } from "../errors/index.js";

/**
 * Fetches all user roles from the database.
 *
 * @returns {Promise<Array<userRoles>>} A promise that resolves to an array of user roles.
 * @throws {HttpError} Throws an error if the fetch operation fails.
 */
export async function fetchUserRoles(): Promise<Array<models.userRoles>> {
  try {
    const rolesWithPermissionsJSON = await db.userRoles.findAll({ raw: true });

    return rolesWithPermissionsJSON;
  } catch (error) {
    throw new HttpError(500, "Failed to fetch user roles.", error);
  }
}
