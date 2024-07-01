import express from "express";
import buildingsCtrl from "../../controllers/buildings.controller.js";
import { isValidUUID } from "../../middlewares/validation.js";
const buildingRoutes = express.Router();

buildingRoutes.get("/", buildingsCtrl.getAll);
buildingRoutes.get("/details/:id", [isValidUUID("id")], buildingsCtrl.getDetails);
buildingRoutes.get("/near-by", buildingsCtrl.getNearbyBuildings);
buildingRoutes.get("/amenities", buildingsCtrl.getAmenities);
buildingRoutes.get("/policies", buildingsCtrl.getPolicies);

export default buildingRoutes;
