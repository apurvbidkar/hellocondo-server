import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface buildingPsfHoaAttributes {
  id: number;
  buildingId?: number;
  listingDetails?: object;
  averagePsf?: object;
  averageHoa?: object;
}

export type buildingPsfHoaPk = "id";
export type buildingPsfHoaId = buildingPsfHoa[buildingPsfHoaPk];
export type buildingPsfHoaOptionalAttributes = "id" | "buildingId" | "listingDetails" | "averagePsf" | "averageHoa";
export type buildingPsfHoaCreationAttributes = Optional<buildingPsfHoaAttributes, buildingPsfHoaOptionalAttributes>;

export class buildingPsfHoa extends Model<buildingPsfHoaAttributes, buildingPsfHoaCreationAttributes> implements buildingPsfHoaAttributes {
  id!: number;
  buildingId?: number;
  listingDetails?: object;
  averagePsf?: object;
  averageHoa?: object;


  static initModel(sequelize: Sequelize.Sequelize): typeof buildingPsfHoa {
    return buildingPsfHoa.init({
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    buildingId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "buildings",
        key: "id",
      },
      field: "building_id"
    },
    listingDetails: {
      type: DataTypes.JSON,
      allowNull: true,
      field: "listing_details"
    },
    averagePsf: {
      type: DataTypes.JSON,
      allowNull: true,
      field: "average_psf"
    },
    averageHoa: {
      type: DataTypes.JSON,
      allowNull: true,
      field: "average_hoa"
    }
  }, {
    sequelize,
    tableName: 'building_psf_hoa',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "building_psf_hoa_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
