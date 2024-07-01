import { sequelize, sq } from "@condo-server/db-models";
import { Response } from "express";
import {
  ValidateListItemsParams,
  checkItems,
  createItemGroup,
  getItemsList,
  updateItemsToNewGroup,
  validateCreateGroupPayload,
} from "../services/amenitiesPolicies.services.js";
import { GroupAmenityAndPolicyParams, listItemsParams } from "../types/amenitiesPolicies.types.js";
import { RequestWithUser } from "../types/index.js";
import { CreateGroupResponse, ListAmenityAndPolicyResponses } from "../viewModel/amenitiesPolicies.viewModel.js";

export const createGroup = async (req: RequestWithUser, res: Response): Promise<void> => {
  const transaction: sq.Transaction = await sequelize.transaction();
  try {
    let createdBy: string = req?.user?.id;
    const value: GroupAmenityAndPolicyParams = await validateCreateGroupPayload(req.body);
    let { process, items, icon }: GroupAmenityAndPolicyParams = value;
    const itemsIds: string[] = items.map((item) => item.id);
    await checkItems(itemsIds, process == true ? "amenities" : "policies");
    const [createGroupResponse, task] = await createItemGroup(
      value,
      process == true ? "groupAmenities" : "groupPolicies",
      createdBy,
      transaction,
    );
    await updateItemsToNewGroup(
      createGroupResponse.id,
      items,
      icon,
      process == true ? "amenities" : "policies",
      transaction,
    );
    await transaction.commit();
    res.status(200).json({
      status: "success",
      message: process == true ? `Amenities Group ${task}` : `Policies Group ${task}`,
    });
  } catch (error) {
    await transaction.rollback();
    res.status(error?.statusCode || 500).json({
      status: "failed",
      message: error?.message || "Error",
    });
  }
};

export const listItems = async (req: RequestWithUser, res: Response): Promise<void> => {
  try {
    const value: listItemsParams = await ValidateListItemsParams(req.query);
    const { flag }: listItemsParams = value;
    let items: ListAmenityAndPolicyResponses[] | [] = await getItemsList(flag);
    res.status(200).json({
      status: "success",
      message: items,
    });
  } catch (error) {
    res.status(error?.statusCode || 500).json({
      status: "failed",
      message: error?.message || "Error",
    });
  }
};
