import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface usStateZipCodesAttributes {
  state?: string;
  metro?: string;
  county?: string;
  city?: string;
  zip?: number;
  id: number;
}

export type usStateZipCodesPk = "id";
export type usStateZipCodesId = usStateZipCodes[usStateZipCodesPk];
export type usStateZipCodesOptionalAttributes = "state" | "metro" | "county" | "city" | "zip";
export type usStateZipCodesCreationAttributes = Optional<usStateZipCodesAttributes, usStateZipCodesOptionalAttributes>;

export class usStateZipCodes extends Model<usStateZipCodesAttributes, usStateZipCodesCreationAttributes> implements usStateZipCodesAttributes {
  state?: string;
  metro?: string;
  county?: string;
  city?: string;
  zip?: number;
  id!: number;


  static initModel(sequelize: Sequelize.Sequelize): typeof usStateZipCodes {
    return usStateZipCodes.init({
    state: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    metro: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    county: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    zip: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    }
  }, {
    sequelize,
    tableName: 'us_state_zip_codes',
    schema: 'public',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        name: "us_state_zip_codes_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
