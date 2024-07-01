import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface neighborhoodPsfHoaAttributes {
  id: number;
  buildingId?: number;
  neighborhoodName?: string;
  listingDetails?: object;
  averagePsf?: object;
  averageHoa?: object;
}

export type neighborhoodPsfHoaPk = "id";
export type neighborhoodPsfHoaId = neighborhoodPsfHoa[neighborhoodPsfHoaPk];
export type neighborhoodPsfHoaOptionalAttributes = "id" | "buildingId" | "neighborhoodName" | "listingDetails" | "averagePsf" | "averageHoa";
export type neighborhoodPsfHoaCreationAttributes = Optional<neighborhoodPsfHoaAttributes, neighborhoodPsfHoaOptionalAttributes>;

export class neighborhoodPsfHoa extends Model<neighborhoodPsfHoaAttributes, neighborhoodPsfHoaCreationAttributes> implements neighborhoodPsfHoaAttributes {
  id!: number;
  buildingId?: number;
  neighborhoodName?: string;
  listingDetails?: object;
  averagePsf?: object;
  averageHoa?: object;


  static initModel(sequelize: Sequelize.Sequelize): typeof neighborhoodPsfHoa {
    return neighborhoodPsfHoa.init({
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    buildingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "buildings",
        key: "id",
      },
      field: "building_id"
    },
    neighborhoodName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "neighborhood_name"
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
    tableName: 'neighborhood_psf_hoa',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "neighborhood_psf_hoa_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
