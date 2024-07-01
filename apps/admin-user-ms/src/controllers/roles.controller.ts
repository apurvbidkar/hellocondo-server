import { Response } from "express";
import { fetchUserRoles } from "../services/roles.services.js";
import {
  GlobalResponseFailed,
  GlobalResponseSuccess,
  RequestWithLoggedInUser,
  resStatusType,
  RoleWithPermissions,
} from "../types/index.js";
import { fetchPermissions, prettifyPermissions } from "../services/menuPermission.services.js";
import { models } from "@condo-server/db-models";

/**
 * Handles the request to fetch user roles with their associated permissions and sends the response.
 *
 * @param {RequestWithLoggedInUser} req - The request object, including the logged-in user's information.
 * @param {Response} res - The response object.
 * @returns {Promise<Response>} A promise that resolves with the response containing roles with permissions data.
 * @throws {GlobalResponseFailed} Returns an error response if the fetch operation fails.
 */
export async function getRolesWithPermissions(req: RequestWithLoggedInUser, res: Response): Promise<Response> {
  try {
    const roles: models.userRoles[] = await fetchUserRoles();
    const permissions: models.menus[] = await fetchPermissions();

    const prettifiedPermissions: RoleWithPermissions[] = await prettifyPermissions(roles, permissions);
    const response: GlobalResponseSuccess = {
      status: resStatusType.Success,
      message: "Roles with permissions fetched successfully",
      data: prettifiedPermissions,
    };

    res.status(200).json(response);
  } catch (error) {
    const failedResponse: GlobalResponseFailed = {
      status: resStatusType.Failed,
      message: error.message,
    };

    return res.status(error?.statusCode || 500).json(failedResponse);
  }
}
