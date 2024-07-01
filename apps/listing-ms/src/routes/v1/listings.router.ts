import express from "express";
import {
  getBuildingNameByUnitsForSale,
  getFooterNeighborhoodAndZips,
  getFooterNeighborhoods,
  getFooterZips,
  getGeometry,
  getHOAPerSquareFoot,
  getListingImages,
  getLocationSuggestions,
  getPoiCategorySpecific,
  getPoiOnMap,
  getPriceAnalysis,
  getPricePerSquareFoot,
  getSearchListings,
  similarListings,
} from "../../controllers/listings.controller.js";
import { validateFooterNeighborhoodReqQuery } from "../../middlewares/validationMiddlewares.js";
const listingRoutes = express.Router();

listingRoutes.post("/similar-listings/:id", similarListings);
listingRoutes.get("/price-per-square-foot/:buildingId", getPricePerSquareFoot);
listingRoutes.get("/hoa-per-square-foot/:buildingId", getHOAPerSquareFoot);
listingRoutes.get("/images/:id", getListingImages);
listingRoutes.get("/search", getSearchListings);
listingRoutes.get("/building-name/:unitId", getBuildingNameByUnitsForSale);
listingRoutes.get("/price-analysis/:id", getPriceAnalysis);
listingRoutes.get("/poi/:city", getPoiOnMap);
listingRoutes.get("/poi-category/:city/:hcCategory", getPoiCategorySpecific);
listingRoutes.get("/location-suggestions", getLocationSuggestions);
listingRoutes.get("/wkb-geometry", getGeometry);
listingRoutes.get("/footer-neighborhoods-with-zips", validateFooterNeighborhoodReqQuery, getFooterNeighborhoodAndZips);
listingRoutes.get("/footer-neighborhoods", validateFooterNeighborhoodReqQuery, getFooterNeighborhoods);
listingRoutes.get("/footer-zips", validateFooterNeighborhoodReqQuery, getFooterZips);

export default listingRoutes;
