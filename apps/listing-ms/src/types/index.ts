import { UUID } from "crypto";
import { neighborhoods2N } from "shared/db-models/src/lib/models/attom/neighborhoods2N";
import { zipCodeBoundaries } from "shared/db-models/src/lib/models/attom/zipCodeBoundaries";

interface Geo {
  Source: string;
  Schools: School[];
  Coordinates: string;
  Neighborhoods: Neighborhood[];
  SchoolDistrict: District[];
  StructuredStreet: string;
  MacroNeighborhoods: Neighborhood[];
}

interface School {
  Id: string;
  Name: string;
  Level: string;
}

interface Neighborhood {
  Id: string;
  Name: string;
  Metro: string;
}

interface District {
  Id: string;
  Name: string;
}

export interface Media {
  Path: string;
  Order: number;
  Bucket: string;
  ImageWidth: number;
  ImageHeight: number;
}

export interface Listing {
  data: {
    data: [
      {
        id: number;
        geo: Geo;
        feed_slug: string;
        City: string;
        Media: Media[];
        Sewer: string[];
        Cooling: string[];
        Heating: string[];
        TaxYear: number;
        Basement: string[];
        Electric: string[];
        RentalYN: boolean;
        RoomType: string[];
        Township: string;
        CloseDate: string;
        ListPrice: number;
        ListingId: string;
        MlsStatus: string;
        OwnerName: string;
        Ownership: string;
        YearBuilt: number;
        ClosePrice: number;
        Directions: string;
        ListingKey: string;
        LivingArea: number;
        Possession: string[];
        PostalCode: string;
        RoomsTotal: number;
        StreetName: string;
        UnitNumber: string;
        LotFeatures: string[];
        PetsAllowed: string[];
        PhotosCount: number;
        WaterSource: string[];
        DaysOnMarket: number;
        GarageSpaces: number;
        ListAgentKey: string;
        MLSAreaMajor: string;
        ParcelNumber: string;
        PropertyType: string;
        StoriesTotal: number;
        StreetNumber: string;
        StreetSuffix: string;
        WaterfrontYN: boolean;
        BathroomsFull: number;
        BathroomsHalf: number;
        BedroomsTotal: number;
        BuyerAgentKey: string;
        BuyerAgentURL: string;
        ListOfficeFax: string;
        ListOfficeKey: string;
        ListOfficeURL: string;
        OffMarketDate: string;
        PublicRemarks: string;
        AssociationFee: number;
        BuyerOfficeKey: string;
        CountyOrParish: string;
        ListAgentEmail: string;
        ListAgentMlsId: string;
        ListOfficeName: string;
        OtherEquipment: string[];
        StandardStatus: string;
        BuyerAgentEmail: string;
        BuyerAgentMlsId: string;
        BuyerOfficeName: string;
        FireplacesTotal: number;
        ListOfficeMlsId: string;
        ListOfficePhone: string;
        StateOrProvince: string;
        StreetDirPrefix: string;
        SubdivisionName: string;
        TaxAnnualAmount: number;
        BedroomsPossible: number;
        BuyerOfficeMlsId: string;
        BuyerOfficePhone: string;
        InteriorFeatures: string[];
        LivingAreaSource: string;
        ListAgentLastName: string;
        LotSizeDimensions: string;
        NewConstructionYN: boolean;
        OriginalListPrice: number;
        BuyerAgentLastName: string;
        HighSchoolDistrict: string;
        ListAgentFirstName: string;
        BuyerAgentFirstName: string;
        ListingContractDate: string;
        AssociationAmenities: string[];
        ListAgentOfficePhone: string;
        PurchaseContractDate: string;
        StandardPropertyType: string;
        BathroomsTotalInteger: number;
        BuyerAgentOfficePhone: string;
        ModificationTimestamp: string;
        OriginatingSystemName: string;
        PhotosChangeTimestamp: string;
        StatusChangeTimestamp: string;
        AssociationFeeIncludes: string[];
        OriginalEntryTimestamp: string;
        AssociationFeeFrequency: string;
        ElementarySchoolDistrict: string;
        InternetAddressDisplayYN: boolean;
        InternetConsumerCommentYN: boolean;
        MiddleOrJuniorSchoolDistrict: string;
        InternetEntireListingDisplayYN: boolean;
        InternetAutomatedValuationDisplayYN: boolean;
        created_at: string;
        entity_key: string;
        listing_id: string;
        updated_at: string;
        pipeline_id: number;
        listing_status: string;
        kepler_checksum: string;
        source_checksum: string;
        source_created_at: string;
        source_updated_at: string;
        modification_timestamp: string;
        photos_change_timestamp: string;
        ingest_time: string;
        encodedImage: string;
        distance: number;
        BuildingName: string;
      },
    ];
    count: number;
  };
}

enum InquiryType {
  Buying = "Buying",
  Selling = "Selling",
  Renting = "Buying & Selling",
}

enum PropertyType {
  Any = "Any",
  Residential = "Condo",
  Commercial = "Townhouse",
}

export interface contactAgentFormBody {
  additionalInfo?: string;
  address?: string;
  email: string;
  inquiryType?: InquiryType;
  name: string;
  phoneNumber?: string;
  propertyType?: PropertyType;
  targetPrice?: string;
}

export interface contactUsFormBody {
  email: string;
  name: string;
  phoneNumber: string;
  message: string;
}

export interface ImageData {
  normalImages: string[];
  thumbnailImages: string[];
}

export interface Coordinate {
  lat: number;
  lon: number;
}

interface PsfData {
  building: number;
  neighbor: number;
}

export type ChartPsfData = {
  [year: string]: PsfData;
};

export interface getBuildingNameByUnitsForSaleResponse {
  id: string;
  name: string;
  geoId: number;
  address: string;
  buildingSlug?: string;
  unitsForSale: string[];
  country: string;
  state: string;
  metro: string;
  city: string;
  zip: number;
}

export interface DatasetForChart {
  label: string;
  backgroundColor: string;
  borderRadius: number;
  data: number[];
}

export interface TransformedDataForChart {
  labels: string[];
  datasets: DatasetForChart[];
}
export interface locationSearch {
  id: UUID;
  name: string;
  type: string;
  state: string;
  metro: string;
  county: string;
}

export type wkbGeometry = {
  name: string;
  type: string;
  wkb_geometry: geometry;
};

interface geometry {
  crs: object;
  type: string;
  coordinates: number[][][][];
}

export interface FooterNeighborhoodReqQuery {
  latitude: number;
  longitude: number;
  distance?: number;
  limit?: number;
  state?: string;
  county: string;
  city: string;
  distanceUnit?: DistanceUnit;
  nameOrder?: "ASC" | "DESC";

  zipOrder?: "ASC" | "DESC";
}

export type DistanceUnit = "m" | "km" | "mi" | "yd" | "ft";

export interface NearbySearchParameters {
  state: string;
  county: string;
  longitude: number;
  latitude: number;
  distance: number;
  limit: number;
  distanceInMeters: number;

  nameOrder?: "ASC" | "DESC";
  zipOrder?: "ASC" | "DESC";
}

export interface NearbyZipCode extends zipCodeBoundaries {
  distance: number;
}

export interface NearbyNeighborhood extends neighborhoods2N {
  distance: number;
}
