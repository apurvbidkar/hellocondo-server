import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { buildings, buildingsId } from './buildings.js';

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


export type listingsDataPk = "id";
export type listingsDataId = listingsData[listingsDataPk];
export type listingsDataOptionalAttributes = "id"
  | "listingId"
  | "buildingId"
  | "listingPsf"
  | "listingLivingArea"
  | "listingPrice"
  | "daysOnMarket"
  | "totalParking"
  | "bedrooms"
  | "bathrooms"
  | "similarListingDetails"
  | "closedListingsDetails"
  | "psfForSimilarListings"
  | "psfDiffSimilarListings"
  | "psfPercentDifferenceSimilarListings"
  | "listingPriceDifferenceSimilarListings"
  | "listingPriceDifferencePercentSimilarListings"
  | "psfForClosedListings"
  | "psfDiffForClosedListings"
  | "psfPercentDifferenceClosedListings";
export type listingsDataCreationAttributes = Optional<listingsDataAttributes, listingsDataOptionalAttributes>;

export class listingsData extends Model<listingsDataAttributes, listingsDataCreationAttributes> implements listingsDataAttributes {
  id!: string;
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

  // listingsData belongsTo buildings via building_id
  building!: buildings;
  getBuilding!: Sequelize.BelongsToGetAssociationMixin<buildings>;
  setBuilding!: Sequelize.BelongsToSetAssociationMixin<buildings, buildingsId>;
  createBuilding!: Sequelize.BelongsToCreateAssociationMixin<buildings>;

  static initModel(sequelize: Sequelize.Sequelize): typeof listingsData {
    return listingsData.init({
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    listingId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "listing_id"
    },
    buildingId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'buildings',
        key: 'id'
      },
      field: "building_id"
    },
    listingPsf: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "listing_psf"
    },
    listingLivingArea: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "listing_living_area"
    },
    listingPrice: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "listing_price"
    },
    daysOnMarket: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "days_on_market"
    },
    totalParking: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "total_parking"
    },
    bedrooms: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bathrooms: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    similarListingDetails: {
      type: DataTypes.ARRAY(DataTypes.JSONB),
      allowNull: true,
      field: "similar_listing_details"
    },
    closedListingsDetails: {
      type: DataTypes.ARRAY(DataTypes.JSONB),
      allowNull: true,
      field: "closed_listings_details"
    },
    psfForSimilarListings: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "psf_for_similar_listings"
    },
    psfDiffSimilarListings: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "psf_diff_similar_listings"
    },
    psfPercentDifferenceSimilarListings: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "psf_percent_difference_similar_listings"
    },
    listingPriceDifferenceSimilarListings: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "listing_price_difference_similar_listings"
    },
    listingPriceDifferencePercentSimilarListings: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "listing_price_difference_percent_similar_listings"
    },
    psfForClosedListings: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "psf_for_closed_listings"
    },
    psfDiffForClosedListings: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "psf_diff_for_closed_listings"
    },
    psfPercentDifferenceClosedListings: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "psf_percent_difference_closed_listings"
    }
  }, {
    sequelize,
    tableName: 'listings_data',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "listings_data_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
