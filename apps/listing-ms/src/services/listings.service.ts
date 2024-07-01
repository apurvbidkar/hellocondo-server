/* eslint-disable no-prototype-builtins */
// import { Transaction } from "sequelize";
import { db, dbAttom, sequelize, sequelizeAttom, sq } from "@condo-server/db-models";
import { HttpError } from "../errors/index.js";
import { getCategoryAndLineOfBusiness } from "../helpers/listings.js";
import {
  getNearbyNeighborhoodsExcludingCurrentSQL,
  getNearbyZipCodesExcludingCurrentSQL,
  getPoiDataForListing,
  updateOrderClauseForFooterAPI,
} from "../sql/index.sql.js";
import {
  ChartPsfData,
  NearbyNeighborhood,
  NearbySearchParameters,
  NearbyZipCode,
  contactAgentFormBody,
  contactUsFormBody,
  getBuildingNameByUnitsForSaleResponse,
  locationSearch,
  wkbGeometry,
} from "../types/index.js";
import { commissionsIncPoiAttributes, listingsDataAttributes } from "../viewModels/listing.viewModel.js";

export const createContactAgent = async (
  formData: contactAgentFormBody,
  transaction: sq.Transaction,
): Promise<boolean> => {
  try {
    await db.speaktoAgent.create(formData, { transaction });
    return true;
  } catch (error) {
    throw new HttpError(500, "Failed to create data");
  }
};

export const createContactUsData = async (
  formData: contactUsFormBody,
  transaction: sq.Transaction,
): Promise<boolean> => {
  try {
    await db.inquiries.create(formData, { transaction });
    return true;
  } catch (error) {
    throw new HttpError(500, "Failed to create data");
  }
};

export const generatePriceAnalysis = async (listingId: string): Promise<listingsDataAttributes> => {
  try {
    const paData = await db.listingsData.findOne({
      raw: true,
      attributes: [
        "listingPriceDifferenceSimilarListings",
        "listingPriceDifferencePercentSimilarListings",
        "psfPercentDifferenceSimilarListings",
        "psfPercentDifferenceClosedListings",
      ],
      where: { listingId },
    });
    return paData;
  } catch (error) {
    throw new HttpError(500, "Failed to create data");
  }
};

export async function getPricePerSquareFoots(buildingId: string): Promise<ChartPsfData[] | undefined> {
  try {
    const buildingPsf = await db.buildingPsfHoa.findOne({
      where: {
        buildingId,
      },
      attributes: ["averagePsf"],
    });
    const neighborPsf = await db.neighborhoodPsfHoa.findOne({
      where: {
        buildingId,
      },
      attributes: ["averagePsf"],
    });
    const currentYear: number = new Date().getFullYear();
    const res: ChartPsfData[] = [];
    for (let i = currentYear; i > 0; i--) {
      const fDataObj = {};
      if (buildingPsf?.dataValues.averagePsf && buildingPsf.dataValues.averagePsf.hasOwnProperty(i)) {
        fDataObj[i] = {
          building: buildingPsf.dataValues.averagePsf[i].Average_psf,
          neighbor: 0,
        };
        res.push(fDataObj);
      }
      if (neighborPsf?.dataValues.averagePsf && neighborPsf.dataValues.averagePsf.hasOwnProperty(i)) {
        if (fDataObj[i]) {
          fDataObj[i].neighbor = neighborPsf.dataValues.averagePsf[i].Average_psf;
        } else {
          fDataObj[i] = {
            building: 0,
            neighbor: neighborPsf.dataValues.averagePsf[i].Average_psf,
          };
          res.push(fDataObj);
        }
      }
      if (res.length >= 5) {
        break;
      }
    }
    const sortedData = res.sort((a, b) => {
      const yearA = parseInt(Object.keys(a)[0]);
      const yearB = parseInt(Object.keys(b)[0]);
      return yearA - yearB;
    });
    return sortedData;
  } catch (error) {
    console.log(error);
    throw new HttpError(500, error.message);
  }
}

export const getHOAPerSquareFoots = async (buildingId: string): Promise<ChartPsfData[] | undefined> => {
  try {
    const buildingHoa = await db.buildingPsfHoa.findOne({
      where: {
        buildingId,
      },
      attributes: ["averageHoa"],
    });
    const neighborHoa = await db.neighborhoodPsfHoa.findOne({
      where: {
        buildingId,
      },
      attributes: ["averageHoa"],
    });
    const currentYear: number = new Date().getFullYear();
    const res: ChartPsfData[] = [];

    for (let i = currentYear; i > 0; i--) {
      const fDataObj = {};
      if (buildingHoa?.dataValues.averageHoa && buildingHoa.dataValues.averageHoa.hasOwnProperty(i)) {
        fDataObj[i] = {
          building: buildingHoa.dataValues.averageHoa[i].Average_hoa,
          neighbor: 0,
        };
        res.push(fDataObj);
      }
      if (neighborHoa?.dataValues.averageHoa && neighborHoa.dataValues.averageHoa.hasOwnProperty(i)) {
        if (fDataObj[i]) {
          fDataObj[i].neighbor = neighborHoa.dataValues.averageHoa[i].Average_hoa;
        } else {
          fDataObj[i] = {
            building: 0,
            neighbor: neighborHoa.dataValues.averageHoa[i].Average_hoa,
          };
          res.push(fDataObj);
        }
      }
      if (res.length >= 5) {
        break;
      }
    }
    const sortedData = res.sort((a, b) => {
      const yearA = parseInt(Object.keys(a)[0]);
      const yearB = parseInt(Object.keys(b)[0]);
      return yearA - yearB;
    });
    return sortedData;
  } catch (error) {
    console.log(error);
    throw new HttpError(500, error.message);
  }
};

export const getBuildingNameByUnitsForSaleService = async (
  unitForSaleId: string,
): Promise<getBuildingNameByUnitsForSaleResponse> => {
  try {
    const buildings = (await db.buildings.findAll({
      where: {
        unitsForSale: {
          [sq.Op.contains]: [unitForSaleId],
        },
      },
      include: [
        {
          model: db.geoHierarchy,
          association: new sq.HasOne(db.buildings, db.geoHierarchy, { sourceKey: "geoId", foreignKey: "id" }),
          required: false,
          attributes: [],
        },
      ],
      attributes: [
        "id",
        "name",
        "geoId",
        "address",
        "buildingSlug",
        "unitsForSale",
        [sq.col("country"), "country"],
        [sq.col("state"), "state"],
        [sq.col("metro"), "metro"],
        [sq.col("city"), "city"],
        [sq.col("geoHierarchy.zip"), "zip"],
      ],
    })) as unknown as getBuildingNameByUnitsForSaleResponse;
    return buildings;
  } catch (error) {
    console.log(error);
    throw new HttpError(500, error.message);
  }
};

export const getLocationSuggestionsService = async (query): Promise<locationSearch[]> => {
  try {
    const locations = (await dbAttom.searchLocations.findAll({
      where: {
        name: {
          [sq.Op.iLike]: `%${query}%`,
        },
      },
      attributes: ["id", "name", "type", "state", "metro", "county", "mlsLogoUrl"],
      limit: 5,
      raw: true,
    })) as unknown as locationSearch[];
    return locations;
  } catch (error) {
    console.log(error);
    throw new HttpError(500, error.message);
  }
};

export const getPOI = async (
  city: string,
  lat: number,
  lon: number,
  polygon: string,
  hcCategory?: string,
): Promise<commissionsIncPoiAttributes[]> => {
  try {
    const { category, lineOfBusiness } = getCategoryAndLineOfBusiness(hcCategory);
    const query = getPoiDataForListing;

    const poi: commissionsIncPoiAttributes[] = await sequelize.query(query, {
      type: sq.QueryTypes.SELECT,
      replacements: { city, lat, lon, polygon, category, lineOfBusiness },
      model: db.commissionsIncPoi,
      mapToModel: true,
      raw: true,
    });

    return poi;
  } catch (error) {
    throw new HttpError(500, error.message);
  }
};

export const getGeometryService = async (ids: string[]): Promise<wkbGeometry[]> => {
  try {
    const geometry = (await dbAttom.searchLocations.findAll({
      where: {
        id: { [sq.Op.in]: ids },
      },
      attributes: ["name", "type", "wkb_geometry"],
    })) as unknown as wkbGeometry[];
    return geometry;
  } catch (error) {
    console.log(error);
    throw new HttpError(500, error.message);
  }
};

/**
 * Finds the nearest neighborhoods based on the given search criteria.
 *
 * @param {NearbySearchParameters} searchCriteria - The search criteria containing location and distance information.
 * @param {string} searchCriteria.state - The state to search within.
 * @param {string} searchCriteria.county - The county to search within.
 * @param {number} searchCriteria.longitude - The longitude of the location.
 * @param {number} searchCriteria.latitude - The latitude of the location.
 * @param {number} searchCriteria.distanceInMeters - The search radius in meters.
 * @param {number} searchCriteria.limit - The maximum number of neighborhoods to return.
 * @param {string} searchCriteria.nameOrder - The order in which to return the neighborhoods.
 * @returns {Promise<NearbyNeighborhood[]>} - Returns a list of nearby neighborhoods.
 * @throws {HttpError} - Throws an HTTP error if the query fails.
 *
 * @example
 * const params = {
 *   state: 'IL',
 *   county: 'Cook',
 *   longitude: -87.6278,
 *   latitude: 41.8818,
 *   distanceInMeters: 4828.03, // 3 miles
 *   limit: 3
 * };
 *
 */
export async function findNearestNeighborhoods(searchCriteria: NearbySearchParameters): Promise<NearbyNeighborhood[]> {
  try {
    const { state, county, longitude, latitude, distanceInMeters, limit, nameOrder } = searchCriteria;
    let query = getNearbyNeighborhoodsExcludingCurrentSQL;

    // If the nameOrder is provided, update the query to order by name
    if (nameOrder) {
      query = updateOrderClauseForFooterAPI(query, nameOrder, "name");
    }
    // If a limit is provided, add it to the query
    if (limit !== -1) {
      query += ` LIMIT ${limit}`;
    }
    // Execute the raw SQL query to get intersecting areas within 3 miles and ordered by distance
    const areas = (await sequelizeAttom.query(query, {
      replacements: { state, county, longitude, latitude, distanceInMeters, limit },
      type: sq.QueryTypes.SELECT,
    })) as NearbyNeighborhood[];

    if (areas.length === 0) return [];

    return areas;
  } catch (error) {
    throw new HttpError(500, error.message, error);
  }
}

/**
 * Finds the nearest ZIP codes within a specified distance and limit.
 *
 * @param {NearbySearchParameters} searchCriteria - The search parameters.
 * @param {string} searchCriteria.state - The state in which to search.
 * @param {string} searchCriteria.county - The county in which to search.
 * @param {number} searchCriteria.longitude - The longitude of the point to search around.
 * @param {number} searchCriteria.latitude - The latitude of the point to search around.
 * @param {number} searchCriteria.distanceInMeters - The maximum distance in meters to search.
 * @param {number} searchCriteria.limit - The maximum number of ZIP codes to return.
 * @param {string} searchCriteria.zipOrder - The order in which to return the ZIP codes.
 * @returns {Promise<NearbyZipCode[]>} - A promise that resolves to an array of the nearest ZIP codes.
 * @throws {HttpError} - Throws an HTTP error if the query fails.
 *
 * @example
 * const params = {
 *   state: 'IL',
 *   county: 'Cook',
 *   longitude: -87.6278,
 *   latitude: 41.8818,
 *   distanceInMeters: 4828.03, // 3 miles
 *   limit: 3
 * };
 *
 */
export async function findNearestZipCodes(searchCriteria: NearbySearchParameters): Promise<NearbyZipCode[]> {
  try {
    const { state, county, longitude, latitude, distanceInMeters, limit, zipOrder } = searchCriteria;
    let query = getNearbyZipCodesExcludingCurrentSQL;

    // If the zipOrder is provided, update the query to order by zip code
    if (zipOrder) {
      query = updateOrderClauseForFooterAPI(query, zipOrder, "zip5");
    }
    // If a limit is provided, add it to the query
    if (limit !== -1) {
      query += ` LIMIT ${limit}`;
    }
    // Execute the raw SQL query to get intersecting areas within 3 miles and ordered by distance
    const areas = (await sequelizeAttom.query(query, {
      replacements: { state, county, longitude, latitude, distanceInMeters, limit },
      type: sq.QueryTypes.SELECT,
    })) as NearbyZipCode[];

    if (areas.length === 0) return [];

    return areas;
  } catch (error) {
    throw new HttpError(500, error.message, error);
  }
}
