/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataTypes, Model, Optional, Sequelize } from "sequelize";

export interface neighborhoods2NAttributes {
  ogcFid: number;
  id?: string;
  name?: string;
  state?: string;
  statefpcd?: string;
  metro?: string;
  incplace?: string;
  county?: string;
  countyfpcd?: string;
  longitude?: number;
  latitude?: number;
  wkbGeometry?: any;
}

export type neighborhoods2NPk = "ogcFid";
export type neighborhoods2NId = neighborhoods2N[neighborhoods2NPk];
export type neighborhoods2NOptionalAttributes =
  | "ogcFid"
  | "id"
  | "name"
  | "state"
  | "statefpcd"
  | "metro"
  | "incplace"
  | "county"
  | "countyfpcd"
  | "longitude"
  | "latitude"
  | "wkbGeometry";
export type neighborhoods2NCreationAttributes = Optional<neighborhoods2NAttributes, neighborhoods2NOptionalAttributes>;

export class neighborhoods2N
  extends Model<neighborhoods2NAttributes, neighborhoods2NCreationAttributes>
  implements neighborhoods2NAttributes
{
  ogcFid!: number;
  id?: string;
  name?: string;
  state?: string;
  statefpcd?: string;
  metro?: string;
  incplace?: string;
  county?: string;
  countyfpcd?: string;
  longitude?: number;
  latitude?: number;
  wkbGeometry?: any;

  static initModel(sequelize: Sequelize): typeof neighborhoods2N {
    return neighborhoods2N.init(
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
        name: {
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
        metro: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        incplace: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        county: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        countyfpcd: {
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
        tableName: "neighborhoods_2n",
        schema: "public",
        timestamps: false,
        indexes: [
          {
            name: "neighborhoods_2n_pkey",
            unique: true,
            fields: [{ name: "ogc_fid" }],
          },
          {
            name: "neighborhoods_2n_wkb_geometry_geom_idx",
            fields: [{ name: "wkb_geometry" }],
          },
        ],
      },
    );
  }
}
