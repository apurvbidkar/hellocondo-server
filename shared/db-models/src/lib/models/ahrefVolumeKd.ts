import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";

export interface ahrefVolumeKdAttributes {
  id: string;
  slug?: string;
  data?: object;
  sumVolume?: number;
  sumKd?: number;
  aggregateKd?: number;
  dateImported?: Date;
}

export type ahrefVolumeKdPk = "id";
export type ahrefVolumeKdId = ahrefVolumeKd[ahrefVolumeKdPk];
export type ahrefVolumeKdOptionalAttributes = "slug" | "data" | "sumVolume" | "sumKd" | "aggregateKd" | "dateImported";
export type ahrefVolumeKdCreationAttributes = Optional<ahrefVolumeKdAttributes, ahrefVolumeKdOptionalAttributes>;

export class ahrefVolumeKd
  extends Model<ahrefVolumeKdAttributes, ahrefVolumeKdCreationAttributes>
  implements ahrefVolumeKdAttributes
{
  id!: string;
  slug?: string;
  data?: object;
  sumVolume?: number;
  sumKd?: number;
  aggregateKd?: number;
  dateImported?: Date;

  static initModel(sequelize: Sequelize.Sequelize): typeof ahrefVolumeKd {
    return ahrefVolumeKd.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          unique: "ahref_volume_kd_unique",
        },
        slug: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        data: {
          type: DataTypes.JSON,
          allowNull: true,
        },
        sumVolume: {
          type: DataTypes.BIGINT,
          allowNull: true,
          field: "sum_volume",
        },
        sumKd: {
          type: DataTypes.BIGINT,
          allowNull: true,
          field: "sum_kd",
        },
        aggregateKd: {
          type: DataTypes.DOUBLE,
          allowNull: true,
          field: "aggregate_kd",
        },
        dateImported: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: Sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
          field: "date_imported",
        },
      },
      {
        sequelize,
        tableName: "ahref_volume_kd",
        schema: "public",
        timestamps: false,
        indexes: [
          {
            name: "ahref_volume_kd_id",
            unique: true,
            fields: [{ name: "id" }],
          },
          {
            name: "ahref_volume_kd_pkey",
            unique: true,
            fields: [{ name: "id" }],
          },
          {
            name: "ahref_volume_kd_unique",
            unique: true,
            fields: [{ name: "id" }],
          },
        ],
      },
    );
  }
}
