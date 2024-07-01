import { Router } from "express";
import buildingRoutes from "./buildings.router.js";

const v1Router = Router();
v1Router.use("/buildings", buildingRoutes);

export default v1Router;
