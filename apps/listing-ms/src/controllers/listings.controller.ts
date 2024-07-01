import { sequelize } from "@condo-server/db-models";
import { Request, Response } from "express";
import config from "../config/index.js";
import { convertToMeters, encodedImage, sendEmail } from "../helpers/index.js";
import {
  convertCoordinates,
  convertCoordinateToLonLat,
  extractZipCodesAndNeighborhoods,
  generateEncodedImage,
  generatePolygon,
  generateSimilarListings,
  getLatLong,
  prepareCategorySpecificDataResponse,
  prepareCategoryWiseDataResponse,
  realGeekApiCall,
  transformData,
} from "../helpers/listings.js";
import { constructContactAgentEmailBody, constructContactUsEmailBody } from "../helpers/mailBody.js";
import {
  createContactAgent,
  createContactUsData,
  findNearestNeighborhoods,
  findNearestZipCodes,
  generatePriceAnalysis,
  getBuildingNameByUnitsForSaleService,
  getGeometryService,
  getHOAPerSquareFoots,
  getLocationSuggestionsService,
  getPOI,
  getPricePerSquareFoots,
} from "../services/listings.service.js";
import {
  FooterNeighborhoodReqQuery,
  getBuildingNameByUnitsForSaleResponse,
  Media,
  NearbyNeighborhood,
  NearbySearchParameters,
  NearbyZipCode,
  wkbGeometry,
} from "../types/index.js";
import { validateContactAgentFormReqBody, validateContactUsFormReqBody } from "../validators/index.js";

const sortByOrder = (a: Media, b: Media) => a.Order - b.Order;

/**
 *
 * @param req - The request object, expecting id in the params.
 * @param res - The response object used to send the response to the client.
 * @returns - It will returns the data of listings images
 */
export const getListingImages = async (req: Request, res: Response): Promise<Response> => {
  const normalImages = [];
  const thumbnailImages = [];
  try {
    const { id } = req.params;
    const searchQuery = `{"limit":10,"offset":0,"count":true,"feed_slug":["ilmred"],"StandardPropertyType":"con","ListingId":"${id}"}`;
    const listing = await realGeekApiCall(searchQuery);
    const media = listing.data.data[0].Media;
    media.sort(sortByOrder);

    if (media.length > 0) {
      for (const image of media) {
        const height = config.listingImage.height;
        const width = config.listingImage.width;
        const encodedString = await encodedImage(image, height, width);
        normalImages.push(encodedString);

        const heightThumbnail = config.listingThumbnailImage.height;
        const widthThumbnail = config.listingThumbnailImage.width;
        const encodedThumbnailString = await encodedImage(image, heightThumbnail, widthThumbnail);
        thumbnailImages.push(encodedThumbnailString);
      }
    }
    return res
      .status(200)
      .json({ status: "success", data: { normalImages, thumbnailImages }, message: "Listing fetched successfully" });
  } catch (error) {
    return res.status(error?.statusCode || 500).json({ status: "failed", message: error?.message || "Error" });
  } finally {
    normalImages.length = 0;
    thumbnailImages.length = 0;
  }
};

/**
 *
 * @param req - The request object, expecting details for form in the body.
 * @param res - The response object used to send the response to the client.
 * @returns - It will return status code & message.
 */
export const contactAgent = async (req: Request, res: Response): Promise<Response> => {
  const t = await sequelize.transaction();
  try {
    const formData = await validateContactAgentFormReqBody(req.body);
    const { email } = formData;
    await createContactAgent(formData, t);
    const mailSubject = "HelloCondo - Thanks for inquiring!";
    const emailBody = constructContactAgentEmailBody(email);
    await sendEmail(email, mailSubject, emailBody);
    t.commit();
    return res.status(200).json({ status: "success", data: "", message: "Form has been submitted" });
  } catch (error) {
    t.rollback();
    return res.status(error?.statusCode || 500).json({ status: "failed", message: error?.message || "Error" });
  }
};

/**
 *
 * @param req - The request object, expecting details for form in the body.
 * @param res - The response object used to send the response to the client.
 * @returns - It will return status code & message.
 */
export const contactUs = async (req: Request, res: Response): Promise<Response> => {
  const t = await sequelize.transaction();
  try {
    const formData = await validateContactUsFormReqBody(req.body);
    const { email } = formData;
    await createContactUsData(formData, t);
    const mailSubject = "HelloCondo - Thanks for inquiring!";
    const emailBody = constructContactUsEmailBody(email);
    await sendEmail(email, mailSubject, emailBody);
    t.commit();
    return res.status(200).json({ status: "success", data: "", message: "Form has been submitted" });
  } catch (error) {
    t.rollback();
    return res.status(error?.statusCode || 500).json({ status: "failed", message: error?.message || "Error" });
  }
};

/**
 *
 * @param req - The request object, expecting querystring.
 * @param res - The response object used to send the response to the client.
 * @returns - It will returns the data of listings images
 */
export const getSearchListings = async (req: Request, res: Response): Promise<Response> => {
  try {
    let queryString = req.query.sq as string;
    const locationId = req.query.locationIds as string;
    let geometry: wkbGeometry[];
    if (locationId) {
      const locationIds = locationId.split(",");
      geometry = await getGeometryService(locationIds);
      const polygons = [];
      for (const geo of geometry) {
        polygons.push(convertCoordinates(geo));
      }
      const polygon = polygons.join(";");
      queryString = JSON.parse(queryString);
      queryString["polygon"] = polygon;
      queryString = JSON.stringify(queryString);
    }
    const listings = await realGeekApiCall(encodeURIComponent(queryString));
    const allListings = listings.data;
    for (const listing of allListings.data) {
      const media = listing.Media;
      media.sort(sortByOrder);
      if (media.length > 0) listing.encodedImage = await generateEncodedImage(media);
      const building = await getBuildingNameByUnitsForSaleService(listing.ListingId);
      listing.BuildingName = building?.name ? building.name : "";
    }

    return res
      .status(200)
      .json({ status: "success", data: { allListings, geometry }, message: "Listings fetched successfully" });
  } catch (error) {
    return res.status(error?.statusCode || 500).json({ status: "failed", message: error?.message || "Error" });
  }
};

/**
 *
 * @param req - The request object, expecting querystring.
 * @param res - The response object used to send the response to the client.
 * @returns
 */
export const similarListings = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const query = JSON.stringify(req.body.sq);
    const { coordinates } = req.body;
    const price = req.body.listingprice;
    const maxPrice = parseInt(price) + 25000;
    const minPrice = parseInt(price) - 25000;
    const { latitude, longitude } = getLatLong(coordinates);
    const radius = "2";
    const formattedCoords = generatePolygon(latitude, longitude, radius);
    const similarListings = await generateSimilarListings(
      id,
      query,
      formattedCoords,
      maxPrice,
      minPrice,
      latitude,
      longitude,
    );
    return res
      .status(200)
      .json({ status: "success", data: similarListings.data, message: "Similar listing data fetched successfully" });
  } catch (error) {
    return res.status(error?.statusCode || 500).json({ status: "failed", message: error?.message || "Error" });
  }
};

/**
 *
 * @param req - The request object, expecting listing id.
 * @param res - - The response object used to send the response to the client.
 * @returns
 */
export const getPriceAnalysis = async (req: Request, res: Response): Promise<Response> => {
  try {
    const listingId = req.params.id;
    const paData = await generatePriceAnalysis(listingId);
    let paResp = {};
    if (paData) {
      paResp = {
        propertyPriceDiffTrend: paData.listingPriceDifferenceSimilarListings > 0 ? "up" : "down",
        propertyPriceDiff: Math.abs(paData.listingPriceDifferenceSimilarListings),
        propertyPricePercentDiff: Math.abs(paData.listingPriceDifferencePercentSimilarListings),
        psfTrend: paData.psfPercentDifferenceSimilarListings > 0 ? "up" : "down",
        psfPercentDiff: Math.abs(paData.psfPercentDifferenceSimilarListings),
        soldPsfTrend: paData.psfPercentDifferenceClosedListings > 0 ? "up" : "down",
        soldPsfPercentDiff: Math.abs(paData.psfPercentDifferenceClosedListings),
      };
    }
    return res.status(200).json({ status: "success", data: paResp, message: "Listing data fetched successfully" });
  } catch (error) {
    return res.status(error?.statusCode || 500).json({ status: "failed", message: error?.message || "Error" });
  }
};

/**
 *
 * @param req - The request object, expecting querystring.
 * @param res - The response object used to send the response to the client.
 * @returns
 */
export const getPricePerSquareFoot = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { buildingId } = req.params;
    const ppsf = await getPricePerSquareFoots(buildingId);
    const dataForChart = transformData(ppsf);
    return res
      .status(200)
      .json({ status: "success", data: dataForChart, message: "Price per square foot fetched successfully" });
  } catch (error) {
    return res.status(error?.statusCode || 500).json({ status: "failed", message: error?.message || "Error" });
  }
};

/**
 *
 * @param req - The request object, expecting querystring.
 * @param res - The response object used to send the response to the client.
 * @returns
 */
export const getHOAPerSquareFoot = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { buildingId } = req.params;
    const ppsf = await getHOAPerSquareFoots(buildingId);
    const dataForChart = transformData(ppsf);
    return res
      .status(200)
      .json({ status: "success", data: dataForChart, message: "HOA fees per square foot fetched successfully" });
  } catch (error) {
    return res.status(error?.statusCode || 500).json({ status: "failed", message: error?.message || "Error" });
  }
};

/**
 *
 * @param req - The request object, expecting querystring.
 * @param res - The response object used to send the response to the client.
 * @returns
 */
export const getPoiOnMap = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { city } = req.params;
    const radius = req.query.radius as string;
    const coordinates = req.query.coordinates.toString();
    const { latitude, longitude } = getLatLong(coordinates);
    const polygon = generatePolygon(latitude, longitude, radius);
    const requiredPolygon = convertCoordinateToLonLat(polygon);
    const poiData = await getPOI(city, latitude, longitude, requiredPolygon);
    const resp = prepareCategoryWiseDataResponse(poiData);
    return res
      .status(200)
      .json({ status: "success", data: resp, message: "Point Of Interest data fetched successfully" });
  } catch (error) {
    return res.status(error?.statusCode || 500).json({ status: "failed", message: error?.message || "Error" });
  }
};

/**
 *
 * @param req - The request object, expecting city & lineOfBusiness in the params.
 * @param res - The response object used to send the response to the client.
 * @returns - It returns poi data based on category
 */
export const getPoiCategorySpecific = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { city, hcCategory } = req.params;
    const coordinates = req.query.coordinates.toString();
    const radius = req.query.radius as string;
    const { latitude, longitude } = getLatLong(coordinates);
    const polygon = generatePolygon(latitude, longitude, radius);
    const requiredPolygon = convertCoordinateToLonLat(polygon);
    const poiData = await getPOI(city, latitude, longitude, requiredPolygon, hcCategory);
    const categoryData = prepareCategorySpecificDataResponse(poiData);
    const resp = {
      type: "FeatureCollection",
      features: categoryData,
    };
    return res
      .status(200)
      .json({ status: "success", data: resp, message: "Point Of Interest data fetched successfully" });
  } catch (error) {
    return res.status(error?.statusCode || 500).json({ status: "failed", message: error?.message || "Error" });
  }
};

/**
 *
 * @param req - The request object, expecting id in the params.
 * @param res - The response object used to send the response to the client.
 * @returns - It will returns the data of Building as per units for sales
 */
export const getBuildingNameByUnitsForSale = async (req: Request, res: Response): Promise<void> => {
  try {
    const { unitId } = req.params;
    const buildingData: getBuildingNameByUnitsForSaleResponse = await getBuildingNameByUnitsForSaleService(unitId);
    res.status(200).json({ status: "success", data: buildingData, message: "Building fetched successfully" });
  } catch (error) {
    console.log(error);
    res.status(error?.statusCode || 500).json({ status: "failed", message: error?.message || "Error" });
  }
};

/**
 *
 * @param req - The request object, expecting id in the params.
 * @param res - The response object used to send the response to the client.
 * @returns - It will returns the data of Building as per units for sales
 */
export const getLocationSuggestions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q } = req.query;
    const buildingData = await getLocationSuggestionsService(q);
    res.status(200).json({ status: "success", data: buildingData, message: "data fetched successfully" });
  } catch (error) {
    console.log(error);
    res.status(error?.statusCode || 500).json({ status: "failed", message: error?.message || "Error" });
  }
};

/**
 *
 * @param req - The request object, expecting id in the params.
 * @param res - The response object used to send the response to the client.
 * @returns - It will returns geometry string to plot in map.
 */
export const getGeometry = async (req: Request, res: Response): Promise<void> => {
  try {
    const ids = req.query.ids as string;

    if (!ids) {
      res.status(400).json({ error: "No IDs provided" });
    }

    const locationIds = ids.split(",");

    const locationData = await getGeometryService(locationIds);
    res.status(200).json({ status: "success", data: locationData, message: "data fetched successfully" });
  } catch (error) {
    console.log(error);
    res.status(error?.statusCode || 500).json({ status: "failed", message: error?.message || "Error" });
  }
};

/**
 * Retrieves the nearest neighborhoods and zip codes based on the provided request parameters.
 *
 * This function handles the request to fetch neighborhoods and zip codes within a specified distance
 * from a given latitude and longitude. The function:
 * 1. Validates the request parameters.
 * 2. Converts the distance from the provided unit to meters.
 * 3. Finds the nearest neighborhoods and zip codes using the search criteria.
 * 4. Sends back the results in the response.
 *
 * @param {Request} req - The request object containing the request parameters.
 * @param {Response} res - The response object to send back the results.
 * @param {Object} req.query - The request parameters.
 * @param {string} req.query.state - The state in which to search for neighborhoods and zip codes.
 * @param {string} req.query.county - The county in which to search for neighborhoods and zip codes.
 * @param {number} req.query.longitude - The longitude of the point to search from.
 * @param {number} req.query.latitude - The latitude of the point to search from.
 * @param {number} req.query.distance - The distance within which to search for neighborhoods and zip codes.
 * @param {number} req.query.limit - The maximum number of results to return.
 * @param {string} req.query.distanceUnit - The unit of the distance parameter (e.g., 'mi' for miles, 'km' for kilometers).
 * @param {string} req.query.nameOrder - The order in which to sort the neighborhood names ('ASC' or 'DESC').
 * @param {string} req.query.zipOrder - The order in which to sort the zip codes ('ASC' or 'DESC').
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 */
export async function getFooterNeighborhoodAndZips(req: Request, res: Response): Promise<void> {
  try {
    const { state, county, distance, limit, longitude, latitude, distanceUnit, nameOrder, zipOrder } =
      req.query as unknown as FooterNeighborhoodReqQuery;

    const searchCriteria: NearbySearchParameters = {
      state,
      county,
      longitude,
      latitude,
      distance,
      limit,
      distanceInMeters: convertToMeters(distance, distanceUnit),
      nameOrder,
      zipOrder,
    };

    const nearbyNeighborhoods: NearbyNeighborhood[] = await findNearestNeighborhoods(searchCriteria);
    const nearbyZipCodes: NearbyZipCode[] = await findNearestZipCodes(searchCriteria);

    const { zipCodes, neighborhoods } = extractZipCodesAndNeighborhoods(nearbyZipCodes, nearbyNeighborhoods);

    res.status(200).json({
      status: "success",
      message: "Neighborhoods and Zip Codes fetched successfully",
      data: { zipCodes, neighborhoods },
    });
  } catch (error) {
    res
      .status(error?.statusCode || 500)
      .json({ status: "failed", message: error?.message || "Failed to fetch neighborhoods and zip codes" });
  }
}

/**
 * Fetches the nearby zip codes based on the provided search criteria.
 *
 * @param {Object} req.query - The request parameters.
 * @param {string} req.query.state - The state in which to search for neighborhoods and zip codes.
 * @param {string} req.query.county - The county in which to search for neighborhoods and zip codes.
 * @param {number} req.query.longitude - The longitude of the point to search from.
 * @param {number} req.query.latitude - The latitude of the point to search from.
 * @param {number} req.query.distance - The distance within which to search for neighborhoods and zip codes.
 * @param {number} req.query.limit - The maximum number of results to return.
 * @param {string} req.query.distanceUnit - The unit of the distance parameter (e.g., 'mi' for miles, 'km' for kilometers).
 * @param {string} req.query.nameOrder - The order in which to sort the neighborhood names ('ASC' or 'DESC').
 * @param {Response} res - The response object for sending the result.
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 */
export async function getFooterNeighborhoods(req: Request, res: Response): Promise<void> {
  try {
    const { state, county, distance, limit, longitude, latitude, distanceUnit, nameOrder } =
      req.query as unknown as Omit<FooterNeighborhoodReqQuery, "zipOrder">;

    const searchCriteria: Omit<NearbySearchParameters, "zipOrder"> = {
      state,
      county,
      longitude,
      latitude,
      distance,
      limit,
      distanceInMeters: convertToMeters(distance, distanceUnit),
      nameOrder,
    };

    const nearbyNeighborhoods: NearbyNeighborhood[] = await findNearestNeighborhoods(searchCriteria);

    const { neighborhoods } = extractZipCodesAndNeighborhoods([], nearbyNeighborhoods);

    res.status(200).json({
      status: "success",
      message: "Neighborhoods fetched successfully",
      data: { neighborhoods },
    });
  } catch (error) {
    res
      .status(error?.statusCode || 500)
      .json({ status: "failed", message: error?.message || "Failed to fetch neighborhoods" });
  }
}

/**
 * Fetches the nearby zip codes based on the provided search criteria.
 *
 * @param {Object} req.query - The request parameters.
 * @param {string} req.query.state - The state in which to search for neighborhoods and zip codes.
 * @param {string} req.query.county - The county in which to search for neighborhoods and zip codes.
 * @param {number} req.query.longitude - The longitude of the point to search from.
 * @param {number} req.query.latitude - The latitude of the point to search from.
 * @param {number} req.query.distance - The distance within which to search for neighborhoods and zip codes.
 * @param {number} req.query.limit - The maximum number of results to return.
 * @param {string} req.query.distanceUnit - The unit of the distance parameter (e.g., 'mi' for miles, 'km' for kilometers).
 * @param {string} req.query.zipOrder - The order in which to sort the zip codes ('ASC' or 'DESC').
 * @param {Response} res - The response object for sending the result.
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 */
export async function getFooterZips(req: Request, res: Response): Promise<void> {
  try {
    const { state, county, distance, limit, longitude, latitude, distanceUnit, zipOrder } =
      req.query as unknown as Omit<FooterNeighborhoodReqQuery, "nameOrder">;

    const searchCriteria: Omit<NearbySearchParameters, "nameOrder"> = {
      state,
      county,
      longitude,
      latitude,
      distance,
      limit,
      distanceInMeters: convertToMeters(distance, distanceUnit),
      zipOrder,
    };

    const nearbyZipCodes: NearbyZipCode[] = await findNearestZipCodes(searchCriteria);

    const { zipCodes } = extractZipCodesAndNeighborhoods(nearbyZipCodes, []);

    res.status(200).json({
      status: "success",
      message: "Zip Codes fetched successfully",
      data: { zipCodes },
    });
  } catch (error) {
    res
      .status(error?.statusCode || 500)
      .json({ status: "failed", message: error?.message || "Failed to fetch zip codes" });
  }
}
