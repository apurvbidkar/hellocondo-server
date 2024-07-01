/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataTypes, Model, Optional, Sequelize } from "sequelize";

export interface zipCodeBoundariesAttributes {
  ogcFid: number;
  id?: string;
  zip5?: string;
  name?: string;
  ziptype?: string;
  state?: string;
  statefpcd?: string;
  countyfpcd?: string;
  county?: string;
  longitude?: number;
  latitude?: number;
  wkbGeometry?: any;
}

export type zipCodeBoundariesPk = "ogcFid";
export type zipCodeBoundariesId = zipCodeBoundaries[zipCodeBoundariesPk];
export type zipCodeBoundariesOptionalAttributes =
  | "ogcFid"
  | "id"
  | "zip5"
  | "name"
  | "ziptype"
  | "state"
  | "statefpcd"
  | "countyfpcd"
  | "county"
  | "longitude"
  | "latitude"
  | "wkbGeometry";
export type zipCodeBoundariesCreationAttributes = Optional<
  zipCodeBoundariesAttributes,
  zipCodeBoundariesOptionalAttributes
>;

export class zipCodeBoundaries
  extends Model<zipCodeBoundariesAttributes, zipCodeBoundariesCreationAttributes>
  implements zipCodeBoundariesAttributes
{
  ogcFid!: number;
  id?: string;
  zip5?: string;
  name?: string;
  ziptype?: string;
  state?: string;
  statefpcd?: string;
  countyfpcd?: string;
  county?: string;
  longitude?: number;
  latitude?: number;
  wkb_geometry?: any;

  static initModel(sequelize: Sequelize): typeof zipCodeBoundaries {
    return zipCodeBoundaries.init(
      {
        ogcFid: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          field: "ogc_fid",
        },
        id: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        zip5: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        ziptype: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        state: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        statefpcd: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        countyfpcd: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        county: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        longitude: {
          type: DataTypes.DOUBLE,
          allowNull: true,
        },
        latitude: {
          type: DataTypes.DOUBLE,
          allowNull: true,
        },
        wkbGeometry: {
          type: DataTypes.GEOMETRY("MULTIPOLYGON", 4326),
          allowNull: true,
          field: "wkb_geometry",
        },
      },
      {
        sequelize,
        tableName: "zip_code_boundaries",
        schema: "public",
        timestamps: false,
        indexes: [
          {
            name: "zip_code_boundaries_pkey",
            unique: true,
            fields: [{ name: "ogc_fid" }],
          },
          {
            name: "zip_code_boundaries_wkb_geometry_geom_idx",
            fields: [{ name: "wkb_geometry" }],
          },
        ],
      },
    );
  }
}
