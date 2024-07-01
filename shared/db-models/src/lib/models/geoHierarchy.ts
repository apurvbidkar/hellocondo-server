import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";

export interface geoHierarchyAttributes {
  id: string;
  country: string;
  stateFull: string;
  state: string;
  metro?: string;
  county?: string;
  city?: string;
  zip?: number;
  neighbourhoodL1?: string;
  neighbourhoodL2?: string;
  neighbourhoodL3?: string;
  neighbourhoodL4?: string;
}

export type geoHierarchyPk = "id";
export type geoHierarchyId = geoHierarchy[geoHierarchyPk];
export type geoHierarchyOptionalAttributes =
  | "id"
  | "metro"
  | "county"
  | "city"
  | "zip"
  | "neighbourhoodL1"
  | "neighbourhoodL2"
  | "neighbourhoodL3"
  | "neighbourhoodL4";
export type geoHierarchyCreationAttributes = Optional<geoHierarchyAttributes, geoHierarchyOptionalAttributes>;

export class geoHierarchy
  extends Model<geoHierarchyAttributes, geoHierarchyCreationAttributes>
  implements geoHierarchyAttributes
{
  id!: string;
  country!: string;
  stateFull!: string;
  state!: string;
  metro?: string;
  county?: string;
  city?: string;
  zip?: number;
  neighbourhoodL1?: string;
  neighbourhoodL2?: string;
  neighbourhoodL3?: string;
  neighbourhoodL4?: string;

  static initModel(sequelize: Sequelize.Sequelize): typeof geoHierarchy {
    return geoHierarchy.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        country: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        stateFull: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: "state_full",
        },
        state: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        metro: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        county: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        city: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        zip: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        neighbourhoodL1: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: "neighbourhood_l1",
        },
        neighbourhoodL2: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: "neighbourhood_l2",
        },
        neighbourhoodL3: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: "neighbourhood_l3",
        },
        neighbourhoodL4: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: "neighbourhood_l4",
        },
      },
      {
        sequelize,
        tableName: "geo_hierarchy",
        schema: "public",
        timestamps: false,
        indexes: [
          {
            name: "geo_hierarchy_id",
            unique: true,
            fields: [{ name: "id" }],
          },
          {
            name: "geo_hierarchy_pkey",
            unique: true,
            fields: [{ name: "id" }],
          },
        ],
      },
    );
  }
}
