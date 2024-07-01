import express from "express";
import { createGroup, listItems } from "../../controllers/amenitiesPolicies.controller.js";
import { checkAuthorization } from "../../middlewares/authorizeMiddleware.js";
import { Action, Section } from "../../types/authorization.types.js";

const policiesAndAmenitiesRoutes = express.Router();

policiesAndAmenitiesRoutes.post("/group", checkAuthorization(Section.MANAGE_AMENITIES, Action.WRITE), createGroup);
policiesAndAmenitiesRoutes.get("/items", checkAuthorization(Section.MANAGE_AMENITIES, Action.READ), listItems);
export default policiesAndAmenitiesRoutes;
