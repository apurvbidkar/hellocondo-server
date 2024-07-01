import express from "express";
import { checkAuthorization } from "../../middlewares/authorizeMiddleware.js";
import { Action, Section } from "../../types/index.js";
import { getRolesWithPermissions } from "../../controllers/roles.controller.js";

const rolesRouter = express.Router();

rolesRouter.get(
  "/roles/permissions",
  checkAuthorization(Section.USER_MANAGEMENT, Action.READ),
  getRolesWithPermissions,
);

export default rolesRouter;
