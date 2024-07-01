import Joi from "joi";
import { AmenityAndPolicy, GroupAmenityAndPolicyParams } from "../types/amenitiesPolicies.types.js";
import {
  DropdownFilterValuesParams,
  DropdownValuesFilterParams,
  GetBuildingsFilterParams,
  GetBuildingsParams,
  MediaCoverageQueryParams,
  getAssignedBuildingsForUserParams,
} from "../types/buildings.types.js";
import {
  DeleteUserDataLocationPermissionPayload,
  ObjectId,
  UserDataLocationPermissionPayload,
  UserDataPermissionPayload,
} from "../types/dataPermission.types.js";

type AllowedObjectType = "state" | "buildings" | "city" | "metro" | "county" | "zip" | "neighbourhood";

const allowedObjectTypes: AllowedObjectType[] = [
  "state",
  "buildings",
  "city",
  "metro",
  "county",
  "zip",
  "neighbourhood",
];

export const getBuildingsSchema = Joi.object<GetBuildingsParams>({
  page: Joi.number().integer().min(1).optional().default(1),
  limit: Joi.number().integer().min(1).optional().default(10),
  userId: Joi.string().guid({ version: "uuidv4" }).optional().default(null),
  filters: Joi.object<GetBuildingsFilterParams>({
    name: Joi.string().optional().default(null),
    state: Joi.string().optional().default(null),
    city: Joi.string().optional().default(null),
    metro: Joi.string().optional().default(null),
    neighbourhood: Joi.string().optional().default(null),
    zip: Joi.number().optional().default(null),
    county: Joi.string().optional().default(null),
  })
    .optional()
    .default({}),
});

export const userDataPermissionSchema = Joi.object<UserDataPermissionPayload>({
  userId: Joi.string().guid({ version: "uuidv4" }).required(),
  objectId: Joi.array().items(Joi.string()).required(),
  objectType: Joi.string()
    .valid(...allowedObjectTypes)
    .lowercase()
    .required(),
  removePermission: Joi.boolean().required(),
  state: Joi.alternatives().conditional("objectType", {
    not: Joi.valid("buildings", "state"),
    then: Joi.string().required(),
    otherwise: Joi.string().optional(),
  }),
});

export const getAssignedBuildingsForUserSchema = Joi.object<getAssignedBuildingsForUserParams>({
  page: Joi.number().integer().min(1).optional().default(1),
  limit: Joi.number().integer().min(1).optional().default(10),
  userId: Joi.string().guid({ version: "uuidv4" }).required(),
});

export const dropdownFilterValuesSchema = Joi.object<DropdownValuesFilterParams>({
  filters: Joi.object<DropdownFilterValuesParams>({
    state: Joi.string().optional(),
    metro: Joi.string().optional(),
    county: Joi.string().optional(),
    city: Joi.string().optional(),
    zip: Joi.number().optional(),
    neighbourhood: Joi.string().optional(),
  })
    .optional()
    .default({}),
});

export const mediaCoverageSchema = Joi.object<MediaCoverageQueryParams>({
  filters: Joi.object<GetBuildingsFilterParams>({
    name: Joi.string().optional().default(null),
    state: Joi.string().optional().default(null),
    city: Joi.string().optional().default(null),
    metro: Joi.string().optional().default(null),
    neighbourhood: Joi.string().optional().default(null),
    zip: Joi.number().optional().default(null),
    county: Joi.string().optional().default(null),
  }),
});

export const uploadBuildingMediaSchema = Joi.object({
  bId: Joi.string().required(),
  images: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().required(),
        seqNo: Joi.number().required(),
        imageUrl: Joi.string().required(),
        thumbUrl: Joi.string().required(),
      }),
    )
    .required(),
  newImages: Joi.array().items(
    Joi.object({
      id: Joi.string().required(),
      seqNo: Joi.number().required(),
      imageUrl: Joi.string().required(),
      thumbUrl: Joi.string().required(),
    }),
  ),
  deletedImages: Joi.array().items(
    Joi.object({
      id: Joi.string().required(),
      imageUrl: Joi.string().required(),
      thumbUrl: Joi.string().required(),
    }),
  ),
  videos: Joi.array().items(
    Joi.object({
      id: Joi.string().required(),
      seqNo: Joi.number().required(),
      videoUrl: Joi.string().required(),
      thumbUrl: Joi.string().required(),
    }),
  ),
  newVideos: Joi.array().items(
    Joi.object({
      id: Joi.string().required(),
      seqNo: Joi.number().required(),
      videoUrl: Joi.string().required(),
      thumbUrl: Joi.string().required(),
    }),
  ),
  deletedVideos: Joi.array().items(
    Joi.object({
      id: Joi.string().required(),
      videoUrl: Joi.string().required(),
      thumbUrl: Joi.string().required(),
    }),
  ),
  videoTourUrl: Joi.array().items(Joi.string().uri()),
});

export const userDataLocationPermissionSchema = Joi.object<UserDataLocationPermissionPayload>({
  userId: Joi.string().guid({ version: "uuidv4" }).required(),
  objectId: Joi.object<ObjectId>({
    state: Joi.string().required(),
    metro: Joi.string().optional().default("All"),
    county: Joi.string().optional().default("All"),
    city: Joi.string().optional().default("All"),
    zip: Joi.string().optional().default("All"),
    neighbourhood: Joi.string().optional().default("All"),
  }).required(),
  objectType: Joi.string().valid("location").required(),
});

export const deleteUserDataLocationPermissionSchema = Joi.object<DeleteUserDataLocationPermissionPayload>({
  userId: Joi.string().guid({ version: "uuidv4" }).required(),
  objectId: Joi.array()
    .items({
      state: Joi.string().required(),
      metro: Joi.string().optional().default("All"),
      county: Joi.string().optional().default("All"),
      city: Joi.string().optional().default("All"),
      zip: Joi.string().optional().default("All"),
      neighbourhood: Joi.string().optional().default("All"),
    })
    .required(),
  objectType: Joi.string().valid("location").required(),
});

const amenityAndPolicyRequestSchema = Joi.object<AmenityAndPolicy>({
  id: Joi.string().required().messages({
    "any.required": "Amenity ID is required.",
    "string.empty": "Amenity ID cannot be empty.",
  }),
  sequenceOrder: Joi.number().required().messages({
    "any.required": "Sequence order is required.",
    "number.base": "Sequence order must be a number.",
  }),
});

export const createGroupRequestSchema = Joi.object<GroupAmenityAndPolicyParams>({
  name: Joi.string().required().messages({
    "any.required": "name is required.",
    "string.empty": "name cannot be empty.",
  }),
  displayName: Joi.string().optional().messages({
    "string.empty": "display name cannot be empty.",
  }),
  sequenceOrder: Joi.number().required().messages({
    "any.required": "Sequence order for group is required.",
    "number.base": "Sequence order for group must be a number.",
  }),
  process: Joi.boolean().required().messages({
    "any.required": "process is required.",
  }),
  items: Joi.array().items(amenityAndPolicyRequestSchema).min(1).required().messages({
    "array.base": "Policies must be an array.",
    "array.min": "At least one policy must be provided.",
  }),
  icon: Joi.string().required().allow("").messages({
    "any.required": "icon is required.",
  }),
});

export const listItemsRequestSchema = Joi.object({
  flag: Joi.boolean().optional().default(false),
});
