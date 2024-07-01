import { Router } from "express";

import emailRoutes from "./emails.router.js";
import rolesRouter from "./roles.router.js";
import userRoutes from "./users.router.js";

import { conformForgetPassword, forgotPassword, logIn, refreshAccessToken } from "../../controllers/user.controller.js";
import { checkAuthorizationForOthers } from "../../middlewares/authorizationForOthers.js";
import { cognitoAuthMiddleware } from "../../middlewares/cognitoAuthMiddleware.js";

const v1Router = Router();

v1Router.post("/login", logIn);
v1Router.post("/forgot-password", forgotPassword);
v1Router.post("/confirm-forgot-password", conformForgetPassword);
v1Router.post("/refresh-token", refreshAccessToken);
// This API is used by other microservices to check if a user has the required permission to perform an action
v1Router.post("/authorization", cognitoAuthMiddleware, checkAuthorizationForOthers);
v1Router.use(cognitoAuthMiddleware, rolesRouter);
v1Router.use(cognitoAuthMiddleware, userRoutes);
v1Router.use(cognitoAuthMiddleware, emailRoutes);

export default v1Router;
