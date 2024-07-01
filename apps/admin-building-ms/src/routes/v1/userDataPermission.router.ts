import express from "express";
import {
  deleteUserDataLocationPermission,
  userDataBuildingPermission,
  userDataLocationPermission,
} from "../../controllers/userDataPermission.controller.js";
import { checkAuthorization } from "../../middlewares/authorizeMiddleware.js";
import { Action, Section } from "../../types/authorization.types.js";
const userDataPermissionRoutes = express.Router();

userDataPermissionRoutes.post(
  "/user-buildings-permission",
  checkAuthorization(Section.USER_MANAGEMENT, Action.WRITE),
  userDataBuildingPermission,
);
userDataPermissionRoutes.post(
  "/user-location-permission",
  checkAuthorization(Section.USER_MANAGEMENT, Action.WRITE),
  userDataLocationPermission,
);
userDataPermissionRoutes.patch(
  "/user-location-permission",
  checkAuthorization(Section.USER_MANAGEMENT, Action.DELETE),
  deleteUserDataLocationPermission,
);
export default userDataPermissionRoutes;
