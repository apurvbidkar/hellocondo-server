import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";

export interface searchLocationsAttributes {
  id: string;
  name?: string;
  type: string;
  mlsLogoUrl: string;
  state: string;
  metro: string;
  county: string;
  wkb_geometry: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export type searchLocationsPk = "id";
export type searchLocationsId = searchLocations[searchLocationsPk];
export type searchLocationsOptionalAttributes =
  | "id"
  | "name"
  | "mlsLogoUrl"
  | "type"
  | "state"
  | "metro"
  | "county"
  | "wkb_geometry"
  | "createdAt"
  | "updatedAt"
  | "deletedAt";
export type searchLocationsCreationAttributes = Optional<searchLocationsAttributes, searchLocationsOptionalAttributes>;

export class searchLocations
  extends Model<searchLocationsAttributes, searchLocationsCreationAttributes>
  implements searchLocationsAttributes
{
  id!: string;
  name?: string;
  mlsLogoUrl!: string;
  type!: string;
  state!: string;
  metro!: string;
  county!: string;
  wkb_geometry!: string;
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt!: Date;

  static initModel(sequelize: Sequelize.Sequelize): typeof searchLocations {
    return searchLocations.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        mlsLogoUrl: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          allowNull: true,
          field: "mls_logo_url",
        },
        type: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        state: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        metro: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        county: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        wkb_geometry: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: "wkb_geometry",
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
          field: "created_at",
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
          field: "updated_at",
        },
        deletedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
          field: "created_at",
        },
      },
      {
        sequelize,
        tableName: "search_locations",
        schema: "public",
        timestamps: false,
        indexes: [
          {
            name: "search_locations_pkey",
            unique: true,
            fields: [{ name: "id" }],
          },
        ],
      },
    );
  }
}
