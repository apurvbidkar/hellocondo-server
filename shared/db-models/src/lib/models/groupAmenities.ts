import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type { amenities, amenitiesId } from "./amenities.js";

export interface groupAmenitiesAttributes {
  id: string;
  name: string;
  displayName?: string;
  icon?: string;
  sequenceOrder: number;
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
  deletedAt?: Date;
  deletedBy?: string;
}

export type groupAmenitiesPk = "id";
export type groupAmenitiesId = groupAmenities[groupAmenitiesPk];
export type groupAmenitiesOptionalAttributes =
  | "id"
  | "displayName"
  | "icon"
  | "createdAt"
  | "updatedAt"
  | "updatedBy"
  | "deletedAt"
  | "deletedBy";
export type groupAmenitiesCreationAttributes = Optional<groupAmenitiesAttributes, groupAmenitiesOptionalAttributes>;

export class groupAmenities
  extends Model<groupAmenitiesAttributes, groupAmenitiesCreationAttributes>
  implements groupAmenitiesAttributes
{
  id!: string;
  name!: string;
  displayName?: string;
  icon?: string;
  sequenceOrder!: number;
  createdAt!: Date;
  createdBy!: string;
  updatedAt?: Date;
  updatedBy?: string;
  deletedAt?: Date;
  deletedBy?: string;

  // groupAmenities hasMany amenities via group_id
  amenities!: amenities[];
  getAmenities!: Sequelize.HasManyGetAssociationsMixin<amenities>;
  setAmenities!: Sequelize.HasManySetAssociationsMixin<amenities, amenitiesId>;
  addAmenity!: Sequelize.HasManyAddAssociationMixin<amenities, amenitiesId>;
  addAmenities!: Sequelize.HasManyAddAssociationsMixin<amenities, amenitiesId>;
  createAmenity!: Sequelize.HasManyCreateAssociationMixin<amenities>;
  removeAmenity!: Sequelize.HasManyRemoveAssociationMixin<amenities, amenitiesId>;
  removeAmenities!: Sequelize.HasManyRemoveAssociationsMixin<amenities, amenitiesId>;
  hasAmenity!: Sequelize.HasManyHasAssociationMixin<amenities, amenitiesId>;
  hasAmenities!: Sequelize.HasManyHasAssociationsMixin<amenities, amenitiesId>;
  countAmenities!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof groupAmenities {
    return groupAmenities.init({
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: false,
          unique: "group_amenities_name_key",
        },
        displayName: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: "display_name",
        },
        icon: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        sequenceOrder: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          field: "sequence_order",
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
          field: "created_at",
        },
        createdBy: {
          type: DataTypes.UUID,
          allowNull: false,
          field: "created_by",
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: "updated_at",
        },
        updatedBy: {
          type: DataTypes.UUID,
          allowNull: true,
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
          field: "deleted_by",
        },
      },
      {
        sequelize,
        tableName: "group_amenities",
        schema: "public",
        timestamps: false,
        indexes: [
          {
            name: "group_amenities_name_key",
            unique: true,
            fields: [
              { name: "name" }
            ],
          },
          {
            name: "group_amenities_pkey",
            unique: true,
            fields: [
              { name: "id" },
            ]
          },
        ]
      });
  }
}
