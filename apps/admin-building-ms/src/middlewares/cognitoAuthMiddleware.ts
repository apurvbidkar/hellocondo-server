import { db, sq } from "@condo-server/db-models";
import axios from "axios";
import { NextFunction, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import jwkToPem from "jwk-to-pem";
import config from "../config/index.js";
import { HttpError } from "../errors/index.js";
import {
  Jwk,
  RequestWithLoggedInUser,
  UserContext,
  UserMenuPermission,
  UserPermissions,
  UserWithRole,
} from "../types/authorization.types.js";
const userPoolId: string | null | undefined = config.cognito.userPoolId;
const region: string | null | undefined = config.cognito.region;
const iss: string | null | undefined = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`;

/**
 * Fetches user permissions based on the provided userId.
 * @param userId - The ID of the user whose permissions are to be fetched.
 * @returns A Promise resolving to an array of objects representing user permissions.
 */
export async function getUserPermissions(userId: string): Promise<Array<UserPermissions>> {
  try {
    const permissions: UserMenuPermission[] = (await db.menuPermissions.findAll({
      where: { userId },
      raw: true,
      nest: true,
      include: [{ model: db.menus, as: "menu" }],
      order: [[{ model: db.menus, as: "menu" }, "seqNo", "ASC"]],
    })) as unknown as UserMenuPermission[];

    const permissionsData: UserPermissions[] = [];

    for (const permission of permissions) {
      const menuData: UserPermissions = {
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
        const parentId: number = Math.floor(permission.menu.seqNo);
        permissionsData[parentId - 1].subPermissions.push(menuData);
      }
    }
    return permissionsData;
  } catch (error) {
    throw new HttpError(500, "Failed to fetch user permissions");
  }
}
const pems: { [key: string]: string } = {};

const getPems = async (): Promise<{ [key: string]: string }> => {
  if (Object.keys(pems).length > 0) return pems;

  const url: string = `${iss}/.well-known/jwks.json`;
  const response: any = await axios.get(url);
  const { keys } = response?.data;

  keys.forEach((key: Jwk) => {
    const keyId = key.kid;
    const jwk = { kty: key.kty, n: key.n, e: key.e };
    pems[keyId] = jwkToPem(jwk);
  });

  return pems;
};

const verifyToken = async (token: string): Promise<JwtPayload> => {
  try {
    const pems: { [key: string]: string } = await getPems();
    const decodedJwt = jwt.decode(token, { complete: true }) as jwt.Jwt & { header: { kid: string } };
    if (!decodedJwt) throw new HttpError(401, "Unauthorized", { status: "failed", message: "Unauthorized" });
    const kid: string = decodedJwt.header.kid;
    const pem = pems[kid];
    if (!pem) throw new HttpError(401, "Unauthorized", { status: "failed", message: "Unauthorized" });
    const decodedToken: JwtPayload = jwt.verify(token, pem, { issuer: iss }) as JwtPayload;
    return decodedToken;
    // TODO: need to remove
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new HttpError(401, error.message === "jwt expired" ? "Unauthorized" : error?.message || "Unauthorized", {
      status: "failed",
      message: error.message === "jwt expired" ? "Unauthorized" : error?.message || "Unauthorized",
    });
  }
};

/**
 * Creates the user context by fetching user details and permissions.
 *
 * @param {string} iamId - The IAM ID of the user.
 * @returns {Promise<object>} The user context data including user details and permissions.
 * @throws {HttpError} Throws an HTTP error with status code 500 if user context creation fails.
 */
export async function createUserContext(iamId: string): Promise<UserContext> {
  try {
    const user: UserWithRole = await fetchUserWithRole("iamId", iamId);

    const permissions: UserPermissions[] = await getUserPermissions(user?.id);

    const responseData = { ...user, permissions };

    return responseData;
  } catch (error) {
    throw new HttpError(500, "Failed to create user context");
  }
}

/**
 * Fetches user information along with their role based on the provided email.
 * @param email - The email address of the user to fetch.
 * @returns A Promise resolving to an object representing the user with their role.
 * @throws {HttpError} If there is an error while fetching the user.
 */
export async function fetchUserWithRole(whereKey: string, whereValue: string): Promise<UserWithRole | null> {
  try {
    const where = { [whereKey]: whereValue, isDelete: false, deletedAt: null };
    const user = (await db.users.findOne({
      where,
      raw: true,
      nest: true,
      attributes: [
        "id",
        "name",
        "email",
        "isPasswordReset",
        [sq.col("role.role_name"), "roleName"],
        [sq.col("role.is_admin"), "isAdmin"],
      ],
      include: [
        {
          model: db.userRoles,
          as: "role",
          attributes: [],
        },
      ],
    })) as unknown as UserWithRole;

    return user;
  } catch (error) {
    throw new HttpError(500, "Failed to fetch user with role by email");
  }
}

const cognitoAuthMiddleware = async (req: RequestWithLoggedInUser, res: Response, next: NextFunction) => {
  const authHeader: string = req.headers?.authorization;
  const idToken: string = req.headers?.idtoken as string;

  if (!authHeader) {
    return res.status(401).json({ status: "failed", message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ status: "failed", message: "Unauthorized" });
  }

  try {
    const decodedToken: JwtPayload = await verifyToken(token);
    const user: UserContext = await createUserContext(decodedToken.sub);
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ status: "failed", message: error.message || "Unauthorized" });
  }
};

export { cognitoAuthMiddleware, verifyToken };
