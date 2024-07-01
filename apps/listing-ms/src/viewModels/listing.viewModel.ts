export interface listingsDataAttributes {
  id: string;
  listingId?: string;
  buildingId?: string;
  listingPsf?: number;
  listingLivingArea?: number;
  listingPrice?: number;
  daysOnMarket?: number;
  totalParking?: number;
  bedrooms?: number;
  bathrooms?: number;
  similarListingDetails?: object[];
  closedListingsDetails?: object[];
  psfForSimilarListings?: number;
  psfDiffSimilarListings?: number;
  psfPercentDifferenceSimilarListings?: number;
  listingPriceDifferenceSimilarListings?: number;
  listingPriceDifferencePercentSimilarListings?: number;
  psfForClosedListings?: number;
  psfDiffForClosedListings?: number;
  psfPercentDifferenceClosedListings?: number;
}

export interface commissionsIncPoiAttributes {
  BusinessLocationID?: number;
  BusinessName?: string;
  Street?: string;
  City?: string;
  StateName?: string;
  Zip?: number;
  CountyName?: string;
  Phone?: string;
  StateCountyFIPS?: number;
  Longitude?: number;
  Latitude?: number;
  GeoQualityCode?: string;
  Category?: string;
  LineOfBusiness?: string;
  Industry?: string;
  SIC1_4?: number;
  distancemiles?: number;
  distanceyards?: number;
}
