import { db, sq } from "@condo-server/db-models";
import { HttpError } from "../errors/index.js";
import {
  DeleteUserDataLocationPermissionPayload,
  ObjectId,
  PermittedBuildingsQueryResponse,
  UserDataLocationPermission,
  UserDataLocationPermissionPayload,
  UserDataPermission,
  UserDataPermissionPayload,
  GetLocationsResponse,
} from "../types/dataPermission.types.js";
import {
  deleteUserDataLocationPermissionSchema,
  userDataLocationPermissionSchema,
  userDataPermissionSchema,
} from "../validators/index.js";
import { GetPermittedLocationResponse } from "../viewModel/dataPermissions.viewModel.js";
import { UserBuildingsResponse } from "../viewModel/buildings.viewModel.js";

export const getPermittedBuildingIds = async (userId: string): Promise<string[] | []> => {
  try {
    const permittedBuildings: PermittedBuildingsQueryResponse = (await db.userDataPermission.findAll({
      where: {
        userId: userId,
        objectType: "buildings",
      },
      attributes: ["object_id", "objectId"],
      raw: true,
    })) as unknown as PermittedBuildingsQueryResponse;
    if (permittedBuildings.length) {
      return permittedBuildings[0]["objectId"];
    } else {
      return [];
    }
  } catch (error: unknown) {
    throw new HttpError(500, "Failed to get permitted buildings");
  }
};

export const validateUserDataPermissionBodyParams = async (bodyParams: UserDataPermissionPayload) => {
  const { error, value } = userDataPermissionSchema.validate(bodyParams);
  if (error) {
    throw new HttpError(400, error.details[0].message);
  }
  return value;
};

export const findUserDataPermission = async (
  userId: string,
  objectType: string,
): Promise<UserDataPermission | null> => {
  try {
    const existingPermission = await db.userDataPermission.findOne({
      where: { userId, objectType },
      attributes: ["id", "userId", "objectId", "objectType"],
    });
    return existingPermission ? (existingPermission as unknown as UserDataPermission) : null;
  } catch (error: unknown) {
    throw new HttpError(500, "Failed to get permitted buildings");
  }
};

export const insertUserPermission = async (
  userId: string,
  objectId: number[] | string[],
  objectType: string,
  transaction: sq.Transaction,
  createdBy: string,
): Promise<void> => {
  try {
    await db.userDataPermission.create(
      {
        userId,
        objectId,
        objectType,
        createdBy,
      },
      { transaction },
    );
    return;
  } catch (error: unknown) {
    throw new HttpError(500, "Failed to add permission");
  }
};

export const deleteRowsForUserPermission = async (
  userId: string,
  objectType: string,
  transaction: sq.Transaction,
): Promise<void> => {
  try {
    await db.userDataPermission.destroy({
      where: {
        userId,
        objectType,
      },
      transaction,
    });
    return;
  } catch (error: unknown) {
    throw new HttpError(500, "Failed to delete user data permission");
  }
};

export const updateUserDataPermission = async (
  existingPermission: UserDataPermission,
  objectId: number[] | string[],
  transaction: sq.Transaction,
  updatedBy: string,
): Promise<void> => {
  try {
    const existingObjectIds: string[] = existingPermission["dataValues"]["objectId"] || [];
    const updatedObjectIdsSet: Set<string> = new Set<string>(existingObjectIds);
    for (const id of objectId) {
      updatedObjectIdsSet.add(id as string);
    }
    const updatedObjectIds: string[] = Array.from(updatedObjectIdsSet);
    await existingPermission.update({ objectId: updatedObjectIds, updatedBy: updatedBy }, { transaction });
    return;
  } catch (error: unknown) {
    throw new HttpError(500, "Failed to update user data permission");
  }
};

export const removeUserDataPermission = async (
  existingPermission: UserDataPermission | null,
  objectId: number[] | string[],
  userId: string,
  objectType: string,
  transaction: sq.Transaction,
  updatedBy: string,
): Promise<void> => {
  try {
    const existingObjectIds: string[] = existingPermission["dataValues"]["objectId"] || [];
    const updatedObjectIds: string[] = existingObjectIds.filter((id) => !objectId.includes(id as never));
    if (updatedObjectIds.length) {
      await existingPermission.update({ objectId: updatedObjectIds, updatedBy: updatedBy }, { transaction });
    } else {
      await deleteRowsForUserPermission(userId, objectType, transaction);
    }
    return;
  } catch (error: unknown) {
    throw new HttpError(500, "Failed to remove user data permission");
  }
};

export const validateUserDataLocationPermissionBodyParams = async (
  bodyParams: UserDataLocationPermissionPayload,
): Promise<UserDataLocationPermissionPayload> => {
  const { error, value } = userDataLocationPermissionSchema.validate(bodyParams);
  if (error) {
    throw new HttpError(400, error.details[0].message);
  }
  return value;
};

export const findUserDataLocationPermission = async (
  userId: string,
  objectType: string,
  objectId: ObjectId,
): Promise<UserDataLocationPermission | null> => {
  try {
    const existingPermission = (await db.userDataPermission.findOne({
      where: { userId, objectType, objectId },
      attributes: ["id", "userId", "objectId", "objectType"],
    })) as unknown as UserDataLocationPermission;
    return existingPermission ? (existingPermission as unknown as UserDataLocationPermission) : null;
  } catch (error: unknown) {
    throw new HttpError(500, "Failed to get permitted buildings");
  }
};

export const insertUserLocationPermission = async (
  userId: string,
  objectId: ObjectId,
  objectType: string,
  transaction: sq.Transaction,
  createdBy: string,
): Promise<void> => {
  try {
    await db.userDataPermission.create(
      {
        userId,
        objectId,
        objectType,
        createdBy,
      },
      { transaction },
    );
    return;
  } catch (error: unknown) {
    throw new HttpError(500, "Failed to add permission");
  }
};

export const removeUserDataLocationPermission = async (
  objectId: ObjectId[],
  userId: string,
  objectType: string,
  transaction: sq.Transaction,
): Promise<number> => {
  try {
    const deleteCriteria = objectId.map((objectId) => ({
      userId,
      objectType,
      objectId: {
        [sq.Op.in]: [objectId],
      },
    }));

    let deletedRowCount = await db.userDataPermission.destroy({
      where: {
        [sq.Op.or]: deleteCriteria,
      },
      transaction,
    });
    return deletedRowCount;
  } catch (error: unknown) {
    throw new HttpError(500, "Failed to remove user data permission");
  }
};

export const getPermittedLocations = async (userId: string, offset: number, limit: number): Promise<GetLocationsResponse | []> => {
  try {
    const userPermittedItems: GetPermittedLocationResponse[] = (await db.userDataPermission.findAndCountAll({
      where: {
        userId: userId,
        objectType: "location",
      },
      attributes: [[sq.literal("object_id::json"), "objectId"]],
      raw: true,
      offset,
      limit,
    })) as unknown as GetPermittedLocationResponse[];
    if (userPermittedItems["rows"].length) {
      const rows: ObjectId[] = userPermittedItems["rows"].map((item) => item.objectId);
      const locations: GetLocationsResponse = {
        count: userPermittedItems["count"],
        rows: rows,
      };
      return locations;
    } else {
      return [];
    }
  } catch (error) {
    throw new HttpError(500, "Failed to get permitted locations");
  }
};

export const getAllPermittedLocations = async (userId: string): Promise<ObjectId[] | []> => {
  try {
    const userPermittedItems: GetPermittedLocationResponse[] = (await db.userDataPermission.findAll({
      where: {
        userId: userId,
        objectType: "location",
      },
      attributes: [[sq.literal("object_id::json"), "objectId"]],
      raw: true,
    })) as unknown as GetPermittedLocationResponse[];
    if (userPermittedItems.length) {
      const allLocations: ObjectId[] = userPermittedItems.map((item) => item.objectId);
      return allLocations;
    } else {
      return [];
    }
  } catch (error) {
    throw new HttpError(500, "Failed to get permitted locations");
  }
};

export const getBuildingsOnAssignedLocations = async (
  permittedLocations: ObjectId[],
  offset: number,
  limit: number,
): Promise<UserBuildingsResponse> => {
  try {
    const whereClause = {
      [sq.Op.or]: permittedLocations.map((filter) => ({
        zip: filter.zip === "All" ? { [sq.Op.not]: null } : filter.zip,
        city: filter.city === "All" ? { [sq.Op.not]: null } : filter.city,
        metro: filter.metro === "All" ? { [sq.Op.not]: null } : filter.metro,
        state: filter.state === "All" ? { [sq.Op.not]: null } : filter.state,
        county: filter.county === "All" ? { [sq.Op.not]: null } : filter.county,
        neighbourhood_l1: filter.neighbourhood === "All" ? { [sq.Op.not]: null } : filter.neighbourhood,
      })),
    };

    const locationBuildings: UserBuildingsResponse = (await db.buildings.findAndCountAll({
      offset,
      limit,
      attributes: [
        "id",
        "name",
        [sq.col("geo.county"), "county"],
        [sq.col("geo.state"), "state"],
        [sq.col("geo.city"), "city"],
        [sq.col("geo.zip"), "zip"],
        [sq.col("geo.metro"), "metro"],
        [sq.col("geo.neighbourhood_l1"), "neighbourhood"],
        [
          sq.literal(
            '(SELECT "sum_volume" FROM "ahref_volume_kd" WHERE "slug" = "buildings"."building_slug" ORDER BY "date_imported" DESC LIMIT 1)',
          ),
          "volume",
        ],
      ],
      include: [
        {
          model: db.geoHierarchy,
          as: "geo",
          where: {
            [sq.Op.and]: whereClause,
          },
          attributes: [],
        },
        {
          model: db.buildingMedia,
          as: "building_media",
          attributes: [],
          required: false,
        },
      ],
      order: [["id", "DESC"]],
      raw: true,
    })) as unknown as UserBuildingsResponse;
    return locationBuildings;
  } catch (error) {
    throw new HttpError(500, "Failed to get buildings for locations");
  }
};

export const validateDeleteUserDataLocationPermissionBodyParams = async (
  bodyParams: DeleteUserDataLocationPermissionPayload,
): Promise<DeleteUserDataLocationPermissionPayload> => {
  const { error, value } = deleteUserDataLocationPermissionSchema.validate(bodyParams);
  if (error) {
    throw new HttpError(400, error.details[0].message);
  }
  return value;
};
