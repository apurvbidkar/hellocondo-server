import { Router } from "express";
import { cognitoAuthMiddleware } from "../../middlewares/cognitoAuthMiddleware.js";
import policiesAndAmenitiesRoutes from "./amenitiesPolicies.router.js";
import buildingRoutes from "./buildings.router.js";
import userDataPermissionRoutes from "./userDataPermission.router.js";

const v1Router = Router();
v1Router.use(cognitoAuthMiddleware, buildingRoutes);
v1Router.use(cognitoAuthMiddleware, userDataPermissionRoutes);
v1Router.use(cognitoAuthMiddleware, policiesAndAmenitiesRoutes);

export default v1Router;
