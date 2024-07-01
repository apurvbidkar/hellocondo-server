import express from "express";

import { checkAuthorization } from "../../middlewares/authorizeMiddleware.js";
import { Action, Section } from "../../types/index.js";
import { checkEmailAvailability } from "../../controllers/email.controller.js";

const emailRoutes = express.Router();

emailRoutes.post("/email/check", checkAuthorization(Section.USER_MANAGEMENT, Action.WRITE), checkEmailAvailability);

export default emailRoutes;
