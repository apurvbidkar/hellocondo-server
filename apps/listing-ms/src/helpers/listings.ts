import axios from "axios";
import config from "../config/index.js";
import { HttpError } from "../errors/index.js";
import { getBuildingNameByUnitsForSaleService } from "../services/listings.service.js";
import {
  ChartPsfData,
  Coordinate,
  DatasetForChart,
  ImageData,
  Listing,
  Media,
  NearbyNeighborhood,
  NearbyZipCode,
  TransformedDataForChart,
  wkbGeometry,
} from "../types/index.js";
import { commissionsIncPoiAttributes } from "../viewModels/listing.viewModel.js";
import { encodedImage } from "./index.js";

const sortByOrder = (a: Media, b: Media) => a.Order - b.Order;

export const realGeekApiCall = async (query: string): Promise<Listing> => {
  const realGeekUrl = `${config.realGeek.apiUrl}?q=${query}`;

  const listings: Listing = await axios.get(realGeekUrl, {
    auth: {
      username: `${config.realGeek.username}`,
      password: `${config.realGeek.password}`,
    },
  });

  return listings;
};

export const generateSimilarListings = async (
  listingId: string,
  baseQuery: string,
  formattedCoords: string,
  maxPrice: number,
  minPrice: number,
  lat: number,
  lon: number,
): Promise<Listing> => {
  try {
    baseQuery = baseQuery.replace(/[{}]/g, "");
    baseQuery += `,"polygon":["${formattedCoords}"],"ListingId_not":"${listingId}"`;
    const searchQuery = encodeURIComponent(`{${baseQuery},"ListPrice_min":${minPrice},"ListPrice_max":${maxPrice}}`);
    let listings = await realGeekApiCall(searchQuery);
    if (listings.data.count < 3) {
      const searchQuery = encodeURIComponent(`{${baseQuery}}`);

      listings = await realGeekApiCall(searchQuery);
    }
    for (const listing of listings.data.data) {
      const media = listing.Media;
      const coord1: Coordinate = { lat, lon };
      const { latitude, longitude } = getLatLong(listing.geo.Coordinates);
      const coord2: Coordinate = { lat: latitude, lon: longitude };
      const distance = await haversineDistance(coord1, coord2);
      listing.distance = distance;
      media.sort(sortByOrder);
      const height = config.listingCardImage.height;
      const width = config.listingCardImage.width;
      if (media.length > 0) {
        const image = media[0];
        const encodedString = await encodedImage(image, height, width);
        listing.encodedImage = encodedString;
      }
      const building = await getBuildingNameByUnitsForSaleService(listing.ListingId);
      listing.BuildingName = building?.name ? building.name : "";
    }
    listings.data.data.sort((a, b) => a.distance - b.distance);
    return listings;
  } catch (error) {
    throw new HttpError(500, error);
  }
};

export const getLatLong = (coordinateString: string): { latitude: number; longitude: number } => {
  // Split the coordinate string by comma
  const [lat, long] = coordinateString.split(",");

  // Parse the split strings into numbers
  const latitude = parseFloat(lat);
  const longitude = parseFloat(long);

  // Return an object with latitude and longitude
  return { latitude, longitude };
};

const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

export const generatePolygon = (centerLat: number, centerLon: number, radius: string): string => {
  const earthRadiusMiles = 3958.8; // Earth radius in miles
  const halfSideMiles = parseFloat(radius) / 2;

  const latOffset = (halfSideMiles / earthRadiusMiles) * (180 / Math.PI);
  const lonOffset = (halfSideMiles / (earthRadiusMiles * Math.cos((centerLat * Math.PI) / 180))) * (180 / Math.PI);

  // Define the coordinates of the square
  const coordinates = [
    [centerLat + latOffset, centerLon - lonOffset], // Top-left
    [centerLat + latOffset, centerLon + lonOffset], // Top-right
    [centerLat - latOffset, centerLon + lonOffset], // Bottom-right
    [centerLat - latOffset, centerLon - lonOffset], // Bottom-left
    [centerLat + latOffset, centerLon - lonOffset], // Closing the loop
  ];

  // Convert the coordinates to a semicolon-separated string
  const coordinatesString = coordinates.map((coord) => coord.join(",")).join(";");

  return coordinatesString;
};

export const generateImages = async (media: Media[]): Promise<ImageData> => {
  const normalImages: string[] = [];
  const thumbnailImages: string[] = [];
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

  return { normalImages, thumbnailImages };
};

export const haversineDistance = async (coord1: Coordinate, coord2: Coordinate): Promise<number> => {
  const R = 3958.8;

  const lat1 = toRadians(coord1.lat);
  const lon1 = toRadians(coord1.lon);
  const lat2 = toRadians(coord2.lat);
  const lon2 = toRadians(coord2.lon);

  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;

  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;
  return distance;
};

export const transformData = (input: ChartPsfData[]): TransformedDataForChart => {
  // Initialize the labels and datasets arrays
  const labels: string[] = [];
  const buildingData: number[] = [];
  const neighborData: number[] = [];

  // Process each year object
  input.forEach((item) => {
    const year = Object.keys(item)[0];
    const data = item[year];
    labels.push(year);
    buildingData.push(data.building);
    neighborData.push(data.neighbor);
  });

  // Create the datasets array
  const datasets: DatasetForChart[] = [
    {
      label: "Building",
      backgroundColor: "#8C93BC",
      borderRadius: 6,
      data: buildingData,
    },
    {
      label: "Neighbourhood",
      backgroundColor: "#E8E8A8",
      borderRadius: 6,
      data: neighborData,
    },
  ];
  return {
    labels,
    datasets,
  };
};

export const prepareCategorySpecificDataResponse = (poiData: commissionsIncPoiAttributes[]) => {
  const features = [];

  for (const poi of poiData) {
    const { BusinessName, Latitude, Longitude } = poi;
    const feature = {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [Longitude, Latitude],
      },
      properties: {
        name: BusinessName,
      },
    };
    features.push(feature);
  }
  return features;
};

export const prepareCategoryWiseDataResponse = (poiData: commissionsIncPoiAttributes[]) => {
  const categoryMap: Record<string, string> = {
    "CATHOLIC SCHOOL": "Schools",
    "PRIVATE SCHOOL": "Schools",
    "PUBLIC SCHOOL": "Schools",
    "JUNIOR COLLEGE": "Schools",
    VOCATIONAL: "Schools",
    "COLLEGE/UNIVERSITY - 4 YEAR +": "Schools",
    "NATIVE AMERICAN SCHOOL": "Schools",
    "GRADUATE SCHOOL ONLY": "Schools",
    "GROCERY STORES AND MARKETS": "Grocery Stores",
    "HEALTH FOOD": "Grocery Stores",
    "FOOD SERVICES": "Bars & Restaurants",
    "MISC EATERIES": "Bars & Restaurants",
    RESTAURANTS: "Bars & Restaurants",
    "BARS - CLUBS": "Bars & Restaurants",
    BARS: "Bars & Restaurants",
  };
  const categoryResp = [];
  const groupedCounts: Record<string, number> = {};
  const shortestDistancesMiles: Record<string, number> = {};
  const shortestDistancesYards: Record<string, number> = {};
  const geoJSON = {};
  poiData.forEach((point) => {
    const hcCategory = categoryMap[point.LineOfBusiness] || point.LineOfBusiness;
    if (!groupedCounts[hcCategory]) {
      groupedCounts[hcCategory] = 0;
    }
    groupedCounts[hcCategory]++;

    if (!(hcCategory in shortestDistancesMiles) || point.distancemiles < shortestDistancesMiles[hcCategory]) {
      shortestDistancesMiles[hcCategory] = point.distancemiles;
      shortestDistancesYards[hcCategory] = point.distanceyards;
    }

    if (!geoJSON[hcCategory]) {
      geoJSON[hcCategory] = {
        type: "FeatureCollection",
        features: [],
      };
    }

    const feature = {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [point.Longitude, point.Latitude],
      },
      properties: {
        name: point.BusinessName,
      },
    };

    geoJSON[hcCategory].features.push(feature);
  });
  const geoJSONFeatures = {};
  Object.keys(geoJSON).forEach((key) => {
    geoJSONFeatures[key.toLowerCase()] = geoJSON[key];
  });
  for (const [category, count] of Object.entries(groupedCounts)) {
    categoryResp.push({
      id: category.toLowerCase(),
      imageSrc: `https://${config.s3.pb}.s3.amazonaws.com/assets/${category.toLowerCase()}.svg`,
      name: category,
      count,
      closestToLocation:
        shortestDistancesMiles[category] > 0.3
          ? shortestDistancesMiles[category].toFixed(2) + " miles"
          : Math.ceil(shortestDistancesYards[category]) + " yards",
    });
    poiData;
  }

  return { categoryResp, geoJSONFeatures };
};

export const convertCoordinateToLonLat = (input: string): string => {
  const coordinatePairs = input.trim().split(";");

  const formattedCoordinates = [];

  for (const pair of coordinatePairs) {
    const [lat, lon] = pair.trim().split(",");
    const formattedPair = `${lon.trim()} ${lat.trim()}`;
    formattedCoordinates.push(formattedPair);
  }

  const result = formattedCoordinates.join(", ");

  return result;
};

export const getCategoryAndLineOfBusiness = (hcCategory?: string) => {
  const hccategory = hcCategory?.toLowerCase();
  let lineOfBusiness: string[];
  let category: string[];
  if (!hccategory) {
    category = ["EDUCATION", "EATING - DRINKING"];
    lineOfBusiness = [
      "CATHOLIC SCHOOL",
      "PRIVATE SCHOOL",
      "PUBLIC SCHOOL",
      "JUNIOR COLLEGE",
      "VOCATIONAL",
      "COLLEGE/UNIVERSITY - 4 YEAR +",
      "NATIVE AMERICAN SCHOOL",
      "GRADUATE SCHOOL ONLY",
      "GROCERY STORES AND MARKETS",
      "HEALTH FOOD",
      "FOOD SERVICES",
      "MISC EATERIES",
      "RESTAURANTS",
      "BARS - CLUBS",
      "BARS",
    ];
  }
  if (hccategory === "schools") {
    category = ["EDUCATION"];
    lineOfBusiness = [
      "CATHOLIC SCHOOL",
      "PRIVATE SCHOOL",
      "PUBLIC SCHOOL",
      "JUNIOR COLLEGE",
      "VOCATIONAL",
      "COLLEGE/UNIVERSITY - 4 YEAR +",
      "NATIVE AMERICAN SCHOOL",
      "GRADUATE SCHOOL ONLY",
    ];
  }
  if (hccategory === "bars & restaurants") {
    category = ["EATING - DRINKING"];
    lineOfBusiness = ["FOOD SERVICES", "MISC EATERIES", "RESTAURANTS", "BARS - CLUBS", "BARS"];
  }
  if (hccategory === "grocery stores") {
    category = ["EATING - DRINKING"];
    lineOfBusiness = ["GROCERY STORES AND MARKETS", "HEALTH FOOD"];
  }

  return { category, lineOfBusiness };
};

export const convertCoordinates = (geo: wkbGeometry): string => {
  const geom = JSON.parse(JSON.stringify(geo));
  const coords = geom.wkb_geometry.coordinates;
  if (!coords.length || !coords[0].length || !coords[0][0].length) {
    throw new Error("Invalid coordinates format");
  }
  return coords[0][0].map((point) => `${point[1]},${point[0]}`).join(";");
};
export function extractZipCodesAndNeighborhoods(
  nearbyZipCodes: NearbyZipCode[],
  nearbyNeighborhoods: NearbyNeighborhood[],
): { zipCodes: string[]; neighborhoods: string[] } {
  const zipCodes: string[] = [];
  const neighborhoods: string[] = [];

  if (nearbyZipCodes.length > 0) {
    // Extract only the ZIP codes of the nearest neighborhoods
    nearbyZipCodes.forEach((zip) => {
      zipCodes.push(zip.zip5);
    });
  }

  if (nearbyNeighborhoods.length > 0) {
    // Extract only the names of the nearest neighborhoods
    nearbyNeighborhoods.forEach((neighborhood) => {
      neighborhoods.push(neighborhood.name);
    });
  }

  return {
    zipCodes,
    neighborhoods,
  };
}

export const generateEncodedImage = async (media: Media[]) => {
  const height = config.listingCardImage.height;
  const width = config.listingCardImage.width;
  const image = media[0];
  return await encodedImage(image, height, width);
};
