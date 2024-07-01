import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type { groupAmenities, groupAmenitiesId } from "./groupAmenities.js";
import type { users, usersId } from "./users.js";

export interface amenitiesAttributes {
  id: string;
  name: string;
  displayName?: string;
  icon?: string;
  sequenceOrder: number;
  isVerified: boolean;
  key?: string;
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
  groupId?: string;
}

export type amenitiesPk = "id";
export type amenitiesId = amenities[amenitiesPk];
export type amenitiesOptionalAttributes =
  | "id"
  | "displayName"
  | "icon"
  | "key"
  | "createdBy"
  | "updatedAt"
  | "updatedBy"
  | "groupId";
export type amenitiesCreationAttributes = Optional<amenitiesAttributes, amenitiesOptionalAttributes>;

export class amenities extends Model<amenitiesAttributes, amenitiesCreationAttributes> implements amenitiesAttributes {
  id!: string;
  name!: string;
  displayName?: string;
  icon?: string;
  sequenceOrder!: number;
  isVerified!: boolean;
  key?: string;
  createdAt!: Date;
  createdBy!: string;
  updatedAt?: Date;
  updatedBy?: string;
  groupId?: string;

  // amenities belongsTo groupAmenities via groupId
  group!: groupAmenities;
  getGroup!: Sequelize.BelongsToGetAssociationMixin<groupAmenities>;
  setGroup!: Sequelize.BelongsToSetAssociationMixin<groupAmenities, groupAmenitiesId>;
  createGroup!: Sequelize.BelongsToCreateAssociationMixin<groupAmenities>;
  // amenities belongsTo users via updated_by
  updated_by_user!: users;
  getUpdated_by_user!: Sequelize.BelongsToGetAssociationMixin<users>;
  setUpdated_by_user!: Sequelize.BelongsToSetAssociationMixin<users, usersId>;
  createUpdated_by_user!: Sequelize.BelongsToCreateAssociationMixin<users>;

  static initModel(sequelize: Sequelize.Sequelize): typeof amenities {
    return amenities.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: false,
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
          field : 'sequence_order'
        },
        isVerified: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          field: "is_verified",
        },
        key: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field : 'created_at'
        },
        createdBy: {
          type: DataTypes.STRING(255),
          allowNull: false,
          defaultValue: "Automation Script",
          field : 'created_by'
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field : 'updated_at'
        },
        updatedBy: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: "users",
            key: "id",
          },
          field : 'updated_by'
        },
        groupId: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: "group_amenities",
            key: "id",
          },
          field : 'group_id'
        },
      },
      {
        sequelize,
        tableName: "amenities",
        schema: "public",
        timestamps: false,
        indexes: [
          {
            name: "amenities_pkey",
            unique: true,
            fields: [{ name: "id" }],
          },
        ],
      },
    );
  }
}
