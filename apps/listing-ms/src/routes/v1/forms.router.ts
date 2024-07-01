import express from "express";
import { contactAgent, contactUs } from "../../controllers/listings.controller.js";
const formRoutes = express.Router();

formRoutes.post("/contact-agent", contactAgent)
formRoutes.post("/contact-us", contactUs)

export default formRoutes;
