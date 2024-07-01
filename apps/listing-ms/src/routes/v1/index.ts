import { Router } from "express";
import formRoutes from "./forms.router.js";
import listingRoutes from "./listings.router.js";

const v1Router = Router();

v1Router.use("/", formRoutes);
v1Router.use("/listings", listingRoutes);

export default v1Router;
