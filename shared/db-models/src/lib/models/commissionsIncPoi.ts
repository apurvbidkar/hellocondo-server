import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

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
}

export type commissionsIncPoiOptionalAttributes = "BusinessLocationID" | "BusinessName" | "Street" | "City" | "StateName" | "Zip" | "CountyName" | "Phone" | "StateCountyFIPS" | "Longitude" | "Latitude" | "GeoQualityCode" | "Category" | "LineOfBusiness" | "Industry" | "SIC1_4";
export type commissionsIncPoiCreationAttributes = Optional<commissionsIncPoiAttributes, commissionsIncPoiOptionalAttributes>;

export class commissionsIncPoi extends Model<commissionsIncPoiAttributes, commissionsIncPoiCreationAttributes> implements commissionsIncPoiAttributes {
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


  static initModel(sequelize: Sequelize.Sequelize): typeof commissionsIncPoi {
    return commissionsIncPoi.init({
    BusinessLocationID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    BusinessName: {
      type: DataTypes.STRING(5000),
      allowNull: true
    },
    Street: {
      type: DataTypes.STRING(5000),
      allowNull: true
    },
    City: {
      type: DataTypes.STRING(5000),
      allowNull: true
    },
    StateName: {
      type: DataTypes.STRING(5000),
      allowNull: true
    },
    Zip: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CountyName: {
      type: DataTypes.STRING(5000),
      allowNull: true
    },
    Phone: {
      type: DataTypes.STRING(5000),
      allowNull: true
    },
    StateCountyFIPS: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Longitude: {
      type: DataTypes.REAL,
      allowNull: true
    },
    Latitude: {
      type: DataTypes.REAL,
      allowNull: true
    },
    GeoQualityCode: {
      type: DataTypes.STRING(5000),
      allowNull: true
    },
    Category: {
      type: DataTypes.STRING(5000),
      allowNull: true
    },
    LineOfBusiness: {
      type: DataTypes.STRING(5000),
      allowNull: true
    },
    Industry: {
      type: DataTypes.STRING(5000),
      allowNull: true
    },
    SIC1_4: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'commissions_inc_poi',
    schema: 'public',
    timestamps: false
  });
  }
}
