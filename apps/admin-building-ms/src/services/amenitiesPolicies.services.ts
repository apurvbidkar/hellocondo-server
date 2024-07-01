import { db, sq } from "@condo-server/db-models";
import { HttpError } from "../errors/index.js";
import { AmenityAndPolicy, GroupAmenityAndPolicyParams, listItemsParams } from "../types/amenitiesPolicies.types.js";
import { createGroupRequestSchema, listItemsRequestSchema } from "../validators/index.js";
import {
  AmenitiesAndPoliciesCheckResponse,
  AmenitiesPoliciesGroup,
  ListAmenityAndPolicyResponses,
} from "../viewModel/amenitiesPolicies.viewModel.js";

export const validateCreateGroupPayload = async (
  bodyParams: GroupAmenityAndPolicyParams,
): Promise<GroupAmenityAndPolicyParams> => {
  const { error, value } = createGroupRequestSchema.validate(bodyParams);
  if (error) {
    throw new HttpError(400, error.details[0].message);
  }
  return value;
};

const checkItemsInternally = async (ids: string[], results: AmenitiesAndPoliciesCheckResponse, process: string) => {
  try {
    const missingIds: string[] = ids.filter((id) => !results.some((item) => item.id === id));
    if (missingIds.length) {
      throw new HttpError(400, `Requested ${process} does not exist`);
    } else {
      const alreadyGrouped: object = {};
      for (let [index, item] of results.entries()) {
        if (item["groupId"] && item["groupName"]) {
          alreadyGrouped[`note-${index + 1}`] = `${item["name"]} is already grouped to ${item["groupName"]}`;
        }
      }
      if (Object.keys(alreadyGrouped).length != 0) {
        throw new HttpError(400, "", alreadyGrouped);
      }
      return;
    }
  } catch (error) {
    console.log("error : ", error);
    throw new HttpError(400, error?.message || error?.body || "Failed To Check Items");
  }
};

export const checkItems = async (ids: string[], process: string): Promise<void> => {
  try {
    const groupModelName: string = process == "amenities" ? "groupAmenities" : "groupPolicies";
    const associationName: string = process == "amenities" ? "group" : "group_policies";
    const results: AmenitiesAndPoliciesCheckResponse | null = (await db[process].findAll({
      where: {
        id: {
          [sq.Op.in]: ids,
        },
      },
      attributes: ["id", "name", "groupId", [sq.col(`${associationName}.name`), "groupName"]],
      include: [
        {
          model: db[groupModelName],
          as: associationName,
          attributes: [],
        },
      ],
      raw: true,
    })) as unknown as AmenitiesAndPoliciesCheckResponse;

    if (results?.length) {
      await checkItemsInternally(ids, results, process);
      return;
    } else {
      throw new HttpError(400, `Requested ${process} does not exist`);
    }
  } catch (error) {
    throw new HttpError(400, error?.message || error?.body || "Failed to find items");
  }
};

export const createItemGroup = async (
  groupData: GroupAmenityAndPolicyParams,
  tableName: string,
  createdBy: string,
  transaction: sq.Transaction,
): Promise<[AmenitiesPoliciesGroup, string]> => {
  try {
    const { name, sequenceOrder, displayName, process, items, icon }: GroupAmenityAndPolicyParams = groupData;
    const [groupResponse, created] = await db[tableName].findOrCreate({
      where: { name },
      defaults: { name, displayName, icon, sequenceOrder, createdBy },
      transaction,
      raw: true,
    });
    const task = !created ? "Updated" : "Created";
    const data = groupResponse?.dataValues ? groupResponse?.dataValues : groupResponse;
    return [data, task];
  } catch (error) {
    throw new HttpError(400, error?.message || "Failed to create group");
  }
};

export const updateItemsToNewGroup = async (
  groupId: string,
  items: AmenityAndPolicy[],
  icon: string,
  tableName: string,
  transaction: sq.Transaction,
): Promise<void> => {
  try {
    for (let rows of items) {
      let updateRowData: object = {
        sequenceOrder: rows.sequenceOrder,
        icon: icon,
        groupId: groupId,
      };
      await db[tableName].update(updateRowData, {
        where: {
          id: rows.id,
        },
        transaction,
      });
    }
    return;
  } catch (error) {
    throw new HttpError(400, error?.message || "Failed to create group");
  }
};

export const ValidateListItemsParams = async (params: listItemsParams): Promise<listItemsParams> => {
  const { error, value } = listItemsRequestSchema.validate(params);
  if (error) {
    throw new HttpError(400, error.details[0].message);
  }
  return value;
};

const formatResponse = async (data: ListAmenityAndPolicyResponses[]): Promise<ListAmenityAndPolicyResponses[] | []> => {
  try {
    const result: ListAmenityAndPolicyResponses[] = [];
    const groupMap = new Map();
    data.forEach((amenity: any) => {
      const amenityData = {
        id: amenity.id,
        name: amenity.name,
        displayName: amenity.displayName,
        icon: amenity.icon,
        sequenceOrder: amenity?.sequenceOrder,
        status: amenity.isVerified ? "active" : "inactive",
      };

      if (amenity.groupId) {
        if (!groupMap.has(amenity.groupId)) {
          groupMap.set(amenity.groupId, {
            groupId: amenity.groupId,
            sequenceOrder: amenity?.groupSequenceOrder,
            name: amenity?.groupName,
            displayName: amenity?.groupDisplayName,
            icon: amenity?.groupIcon,
            amenities: [],
          });
        }
        groupMap.get(amenity.groupId).amenities.push(amenityData);
      } else {
        result.push(amenityData);
      }
    });

    groupMap.forEach((group) => result.push(group));
    result.sort((a, b) => {
      if (a.sequenceOrder < b.sequenceOrder) return -1;
      if (a.sequenceOrder > b.sequenceOrder) return 1;
      return 0;
    });
    return result;
  } catch (error) {
    throw new HttpError(400, error?.message || "Failed to arrange Items");
  }
};

export const getItemsList = async (flag: boolean): Promise<ListAmenityAndPolicyResponses[] | []> => {
  try {
    const tableName: string | null = flag == true ? "amenities" : "policies";
    const groupTableName: string | null = flag == true ? "groupAmenities" : "groupPolicies";
    const associationName: string = flag == true ? "group" : "group_policies";
    const amenitiesWithGroups: ListAmenityAndPolicyResponses[] = (await db[tableName].findAll({
      attributes: [
        "id",
        "name",
        "displayName",
        "icon",
        "sequenceOrder",
        "isVerified",
        "key",
        "groupId",
        [sq.col(`${associationName}.name`), "groupName"],
        [sq.col(`${associationName}.display_name`), "groupDisplayName"],
        [sq.col(`${associationName}.icon`), "groupIcon"],
        [sq.col(`${associationName}.sequence_order`), "groupSequenceOrder"],
      ],
      include: [
        {
          model: db[groupTableName],
          as: associationName,
          attributes: [],
        },
      ],

      raw: true,
    })) as unknown as ListAmenityAndPolicyResponses[];
    if (amenitiesWithGroups.length) {
      const data: ListAmenityAndPolicyResponses[] = await formatResponse(amenitiesWithGroups);
      return data;
    } else {
      return [];
    }
  } catch (error) {
    throw new HttpError(400, error?.message || "Failed to get Items");
  }
};
