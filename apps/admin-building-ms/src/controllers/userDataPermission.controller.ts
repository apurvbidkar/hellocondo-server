import { Request, Response } from "express";
import { HttpError } from "../errors/index.js";
import {
  UserDataPermissionPayload,
  UserDataPermission,
  UserDataLocationPermissionPayload,
  DeleteUserDataLocationPermissionPayload,
} from "../types/dataPermission.types";
import {
  validateUserDataPermissionBodyParams,
  findUserDataPermission,
  insertUserPermission,
  updateUserDataPermission,
  removeUserDataPermission,
  removeUserDataLocationPermission,
  validateUserDataLocationPermissionBodyParams,
  insertUserLocationPermission,
  findUserDataLocationPermission,
  validateDeleteUserDataLocationPermissionBodyParams,
} from "../services/userDataPermission.services.js";
import { sq, sequelize } from "@condo-server/db-models";
import { RequestWithUser } from "../types/index.js";

export const userDataBuildingPermission = async (req: RequestWithUser, res: Response): Promise<void> => {
  const transaction: sq.Transaction = await sequelize.transaction();
  try {
    let createdBy = req?.user?.id;
    let updatedBy = req?.user?.id;
    const value: UserDataPermissionPayload = await validateUserDataPermissionBodyParams(req.body);
    const { userId, objectType, removePermission, objectId }: UserDataPermissionPayload = value;
    const existingPermission: UserDataPermission | null = await findUserDataPermission(userId, objectType);
    let responseString = "";
    if (existingPermission) {
      if (removePermission == true) {
        await removeUserDataPermission(existingPermission, objectId, userId, objectType, transaction, updatedBy);
        responseString = `Permission removed for ${objectType}`;
      } else {
        await updateUserDataPermission(existingPermission, objectId, transaction, updatedBy);
        responseString = `Permission updated for ${objectType}`;
      }
    } else {
      if (removePermission == true) {
        responseString = `Requested Permissions not Found`;
      } else {
        await insertUserPermission(userId, objectId, objectType, transaction, createdBy);
        responseString = `Permission added for ${objectType}`;
      }
    }
    await transaction.commit();
    res.status(200).json({
      status: "success",
      message: responseString,
    });
  } catch (error) {
    await transaction.rollback();
    res.status(error?.statusCode || 500).json({ status: "failed", message: error?.message || "Error" });
  }
};

export const userDataLocationPermission = async (req: RequestWithUser, res: Response): Promise<void> => {
  const transaction: sq.Transaction = await sequelize.transaction();
  try {
    let createdBy = req?.user?.id;
    const value: UserDataLocationPermissionPayload = await validateUserDataLocationPermissionBodyParams(req.body);
    const { userId, objectType, objectId }: UserDataLocationPermissionPayload = value;
    const existingPermission: UserDataPermission | null = await findUserDataLocationPermission(
      userId,
      objectType,
      objectId,
    );

    if (existingPermission) {
      throw new HttpError(400, "Duplicate Permissions");
    } else {
      
      await insertUserLocationPermission(userId, objectId, objectType, transaction, createdBy);
    }
    await transaction.commit();
    res.status(200).json({
      status: "success",
      message: `Permission added for ${objectType}`,
    });
  } catch (error) {
    await transaction.rollback();
    res.status(error?.statusCode || 500).json({ status: "failed", message: error?.message || "Error" });
  }
};

export const deleteUserDataLocationPermission = async (req: RequestWithUser, res: Response): Promise<void> => {
  const transaction: sq.Transaction = await sequelize.transaction();
  try {
    const value: DeleteUserDataLocationPermissionPayload = await validateDeleteUserDataLocationPermissionBodyParams(
      req.body,
    );
    const { userId, objectType, objectId }: DeleteUserDataLocationPermissionPayload = value;
    let deletedCount:number = await removeUserDataLocationPermission(objectId, userId, objectType, transaction);
    await transaction.commit();
    res.status(200).json({
      status: "success",
      message: (deletedCount > 0) ? `Permission removed for ${objectType}` : "Requested Permissions not Found",
    });
  } catch (error) {
    await transaction.rollback();
    res.status(error?.statusCode || 500).json({ status: "failed", message: error?.message || "Error" });
  }
};