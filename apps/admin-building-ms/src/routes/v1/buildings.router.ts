import express from "express";
import {
  getAssignedBuildingsForUser,
  getBuildings,
  getBuildingsFromLocations,
  getFilterDropdownValues,
  getMediaCoverage,
  getUserAssignedLocations,
  uploadBuildingMedia,
} from "../../controllers/building.controller.js";
import { checkAuthorization } from "../../middlewares/authorizeMiddleware.js";
import { Action, Section } from "../../types/authorization.types.js";

const buildingRoutes = express.Router();

buildingRoutes.get(
  "/buildings",
  checkAuthorization(Section.MANAGE_BUILDING_DATA, Action.READ),
  getBuildings,
);

buildingRoutes.get(
  "/user-assigned-buildings",
  checkAuthorization(Section.MANAGE_BUILDING_DATA, Action.READ),
  getAssignedBuildingsForUser,
);

buildingRoutes.get("/building-dropdown-values", getFilterDropdownValues);

buildingRoutes.get(
  "/media-coverage",
  checkAuthorization(Section.MANAGE_BUILDING_MEDIA, Action.READ),
  getMediaCoverage,
);

buildingRoutes.post(
  "/upload-building-media",
  checkAuthorization(Section.MANAGE_BUILDING_DATA, Action.WRITE),
  uploadBuildingMedia,
);

buildingRoutes.get(
  "/user-assigned-locations",
  checkAuthorization(Section.MANAGE_BUILDING_DATA, Action.READ),
  getUserAssignedLocations,
);

buildingRoutes.get(
  "/permitted-location-buildings",
  checkAuthorization(Section.MANAGE_BUILDING_DATA, Action.READ),
  getBuildingsFromLocations,
);

export default buildingRoutes;
