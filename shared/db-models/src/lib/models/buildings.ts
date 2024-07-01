import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type { buildingMedia, buildingMediaId } from "./buildingMedia.js";
import type { geoHierarchy, geoHierarchyId } from "./geoHierarchy.js";
import type { users, usersId } from "./users.js";

export interface buildingsAttributes {
  id: string;
  name: string;
  geoId?: string;
  address: string;
  buildingSlug?: string;
  zip: number;
  houseNumber?: string;
  unitNumber?: string;
  streetNumber?: string;
  streetName?: string;
  streetDirection?: string;
  streetSuffix?: string;
  lat?: number;
  long?: number;
  yearBuilt?: number;
  noOfUnits?: number;
  noOfStories?: number;
  hoaFees?: number;
  newConstruction?: boolean;
  waterfront?: boolean;
  view?: string[];
  unitsForSale?: string[];
  unitIds?: string[];
  averagePsf?: string;
  unitSizeRange?: string;
  summary?: string;
  accessType?: string[];
  policies?: number[];
  amenities?: number[];
  salesReport?: object;
  historicalAvgPricePsf?: object;
  historicalAvgHoaFeesPsf?: object;
  faq?: object;
  aboutProperty?: string;
  hasMediaAttachments?: boolean;
  reviewNeeded?: boolean;
  createdAt: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  deletedAt?: Date;
  deletedBy?: string;
}

export type buildingsPk = "id";
export type buildingsId = buildings[buildingsPk];
export type buildingsOptionalAttributes =
  | "id"
  | "buildingSlug"
  | "houseNumber"
  | "unitNumber"
  | "streetNumber"
  | "streetName"
  | "streetDirection"
  | "streetSuffix"
  | "lat"
  | "long"
  | "yearBuilt"
  | "noOfUnits"
  | "noOfStories"
  | "hoaFees"
  | "newConstruction"
  | "waterfront"
  | "view"
  | "unitsForSale"
  | "unitIds"
  | "averagePsf"
  | "unitSizeRange"
  | "summary"
  | "accessType"
  | "policies"
  | "amenities"
  | "salesReport"
  | "historicalAvgPricePsf"
  | "historicalAvgHoaFeesPsf"
  | "faq"
  | "aboutProperty"
  | "hasMediaAttachments"
  | "reviewNeeded"
  | "createdAt"
  | "createdBy"
  | "updatedAt"
  | "updatedBy"
  | "deletedAt"
  | "deletedBy";
export type buildingsCreationAttributes = Optional<buildingsAttributes, buildingsOptionalAttributes>;

export class buildings extends Model<buildingsAttributes, buildingsCreationAttributes> implements buildingsAttributes {
  id!: string;
  name!: string;
  geoId!: string;
  address!: string;
  buildingSlug?: string;
  zip!: number;
  houseNumber?: string;
  unitNumber?: string;
  streetNumber?: string;
  streetName?: string;
  streetDirection?: string;
  streetSuffix?: string;
  lat?: number;
  long?: number;
  yearBuilt?: number;
  noOfUnits?: number;
  noOfStories?: number;
  hoaFees?: number;
  newConstruction?: boolean;
  waterfront?: boolean;
  view?: string[];
  unitsForSale?: string[];
  unitIds?: string[];
  averagePsf?: string;
  unitSizeRange?: string;
  summary?: string;
  accessType?: string[];
  policies?: number[];
  amenities?: number[];
  salesReport?: object;
  historicalAvgPricePsf?: object;
  historicalAvgHoaFeesPsf?: object;
  faq?: object;
  aboutProperty?: string;
  hasMediaAttachments?: boolean;
  reviewNeeded?: boolean;
  createdAt!: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  deletedAt?: Date;
  deletedBy?: string;

  // buildings hasMany buildingMedia via b_id
  building_media!: buildingMedia[];
  getBuilding_media!: Sequelize.HasManyGetAssociationsMixin<buildingMedia>;
  setBuilding_media!: Sequelize.HasManySetAssociationsMixin<buildingMedia, buildingMediaId>;
  addBuilding_medium!: Sequelize.HasManyAddAssociationMixin<buildingMedia, buildingMediaId>;
  addBuilding_media!: Sequelize.HasManyAddAssociationsMixin<buildingMedia, buildingMediaId>;
  createBuilding_medium!: Sequelize.HasManyCreateAssociationMixin<buildingMedia>;
  removeBuilding_medium!: Sequelize.HasManyRemoveAssociationMixin<buildingMedia, buildingMediaId>;
  removeBuilding_media!: Sequelize.HasManyRemoveAssociationsMixin<buildingMedia, buildingMediaId>;
  hasBuilding_medium!: Sequelize.HasManyHasAssociationMixin<buildingMedia, buildingMediaId>;
  hasBuilding_media!: Sequelize.HasManyHasAssociationsMixin<buildingMedia, buildingMediaId>;
  countBuilding_media!: Sequelize.HasManyCountAssociationsMixin;
  // buildings belongsTo geoHierarchy via geo_id
  geo!: geoHierarchy;
  getGeo!: Sequelize.BelongsToGetAssociationMixin<geoHierarchy>;
  setGeo!: Sequelize.BelongsToSetAssociationMixin<geoHierarchy, geoHierarchyId>;
  createGeo!: Sequelize.BelongsToCreateAssociationMixin<geoHierarchy>;
  // buildings belongsTo users via created_by
  created_by_user!: users;
  getCreated_by_user!: Sequelize.BelongsToGetAssociationMixin<users>;
  setCreated_by_user!: Sequelize.BelongsToSetAssociationMixin<users, usersId>;
  createCreated_by_user!: Sequelize.BelongsToCreateAssociationMixin<users>;
  // buildings belongsTo users via updated_by
  updated_by_user!: users;
  getUpdated_by_user!: Sequelize.BelongsToGetAssociationMixin<users>;
  setUpdated_by_user!: Sequelize.BelongsToSetAssociationMixin<users, usersId>;
  createUpdated_by_user!: Sequelize.BelongsToCreateAssociationMixin<users>;
  // buildings belongsTo users via deleted_by
  deleted_by_user!: users;
  getDeleted_by_user!: Sequelize.BelongsToGetAssociationMixin<users>;
  setDeleted_by_user!: Sequelize.BelongsToSetAssociationMixin<users, usersId>;
  createDeleted_by_user!: Sequelize.BelongsToCreateAssociationMixin<users>;

  static initModel(sequelize: Sequelize.Sequelize): typeof buildings {
    return buildings.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        geoId: {
          type: DataTypes.UUID,
          allowNull: true,
          field: "geo_id",
          references: {
            model: "geo_hierarchy",
            key: "id",
          },
        },
        address: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        buildingSlug: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: "building_slug",
        },
        zip: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        houseNumber: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: "house_number",
        },
        unitNumber: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: "unit_number",
        },
        streetNumber: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: "street_number",
        },
        streetName: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: "street_name",
        },
        streetDirection: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: "street_direction",
        },
        streetSuffix: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: "street_suffix",
        },
        lat: {
          type: DataTypes.DECIMAL,
          allowNull: true,
        },
        long: {
          type: DataTypes.DECIMAL,
          allowNull: true,
        },
        yearBuilt: {
          type: DataTypes.INTEGER,
          allowNull: true,
          field: "year_built",
        },
        noOfUnits: {
          type: DataTypes.INTEGER,
          allowNull: true,
          field: "no_of_units",
        },
        noOfStories: {
          type: DataTypes.INTEGER,
          allowNull: true,
          field: "no_of_stories",
        },
        hoaFees: {
          type: DataTypes.INTEGER,
          allowNull: true,
          field: "hoa_fees",
        },
        newConstruction: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          field: "new_construction",
        },
        waterfront: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        view: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          allowNull: true,
        },
        unitsForSale: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          allowNull: true,
          field: "units_for_sale",
        },
        unitIds: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          allowNull: true,
          field: "unit_ids",
        },
        averagePsf: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: "average_psf",
        },
        unitSizeRange: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: "unit_size_range",
        },
        summary: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        accessType: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          allowNull: true,
          field: "access_type",
        },
        policies: {
          type: DataTypes.ARRAY(DataTypes.INTEGER),
          allowNull: true,
        },
        amenities: {
          type: DataTypes.ARRAY(DataTypes.INTEGER),
          allowNull: true,
        },
        salesReport: {
          type: DataTypes.JSON,
          allowNull: true,
          field: "sales_report",
        },
        historicalAvgPricePsf: {
          type: DataTypes.JSON,
          allowNull: true,
          field: "historical_avg_price_psf",
        },
        historicalAvgHoaFeesPsf: {
          type: DataTypes.JSON,
          allowNull: true,
          field: "historical_avg_hoa_fees_psf",
        },
        faq: {
          type: DataTypes.JSON,
          allowNull: true,
        },
        aboutProperty: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: "about_property",
        },
        hasMediaAttachments: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: false,
          field: "has_media_attachments",
        },
        reviewNeeded: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: false,
          field: "review_needed",
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
          field: "created_at",
        },
        createdBy: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: "users",
            key: "id",
          },
          field: "created_by",
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: Sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
          field: "updated_at",
        },
        updatedBy: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: "users",
            key: "id",
          },
          field: "updated_by",
        },
        deletedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: "deleted_at",
        },
        deletedBy: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: "users",
            key: "id",
          },
          field: "deleted_by",
        },
      },
      {
        sequelize,
        tableName: "buildings",
        schema: "public",
        timestamps: false,
        paranoid: true,
        indexes: [
          {
            name: "buildings_pkey",
            unique: true,
            fields: [{ name: "id" }],
          },
        ],
      },
    );
  }
}
