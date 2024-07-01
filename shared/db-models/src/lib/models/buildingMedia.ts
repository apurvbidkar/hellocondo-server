import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type { buildings, buildingsId } from "./buildings.js";
import type { users, usersId } from "./users.js";

export interface buildingMediaAttributes {
  id: string;
  bId: string;
  images?: object;
  videos?: object;
  videoTourUrl?: object;
  createdBy: string;
  createdAt?: Date;
  updatedBy: string;
  updatedAt?: Date;
}

export type buildingMediaPk = "id";
export type buildingMediaId = buildingMedia[buildingMediaPk];
export type buildingMediaOptionalAttributes = "id" | "images" | "videos" | "videoTourUrl" | "createdAt" | "updatedAt";
export type buildingMediaCreationAttributes = Optional<buildingMediaAttributes, buildingMediaOptionalAttributes>;

export class buildingMedia
  extends Model<buildingMediaAttributes, buildingMediaCreationAttributes>
  implements buildingMediaAttributes
{
  id!: string;
  bId!: string;
  images?: object;
  videos?: object;
  videoTourUrl?: object;
  createdBy!: string;
  createdAt?: Date;
  updatedBy!: string;
  updatedAt?: Date;

  // buildingMedia belongsTo buildings via b_id
  b!: buildings;
  getB!: Sequelize.BelongsToGetAssociationMixin<buildings>;
  setB!: Sequelize.BelongsToSetAssociationMixin<buildings, buildingsId>;
  createB!: Sequelize.BelongsToCreateAssociationMixin<buildings>;
  // buildingMedia belongsTo users via created_by
  created_by_user!: users;
  getCreated_by_user!: Sequelize.BelongsToGetAssociationMixin<users>;
  setCreated_by_user!: Sequelize.BelongsToSetAssociationMixin<users, usersId>;
  createCreated_by_user!: Sequelize.BelongsToCreateAssociationMixin<users>;
  // buildingMedia belongsTo users via updated_by
  updated_by_user!: users;
  getUpdated_by_user!: Sequelize.BelongsToGetAssociationMixin<users>;
  setUpdated_by_user!: Sequelize.BelongsToSetAssociationMixin<users, usersId>;
  createUpdated_by_user!: Sequelize.BelongsToCreateAssociationMixin<users>;

  static initModel(sequelize: Sequelize.Sequelize): typeof buildingMedia {
    return buildingMedia.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        bId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: "buildings",
            key: "id",
          },
          field: "b_id",
        },
        images: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
        videos: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
        videoTourUrl: {
          type: DataTypes.JSONB,
          allowNull: true,
          field: "video_tour_url",
        },
        createdBy: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: "users",
            key: "id",
          },
          field: "created_by",
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: Sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
          field: "created_at",
        },
        updatedBy: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: "users",
            key: "id",
          },
          field: "updated_by",
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: Sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
          field: "updated_at",
        },
      },
      {
        sequelize,
        tableName: "building_media",
        schema: "public",
        timestamps: false,
        indexes: [
          {
            name: "building_media_pkey",
            unique: true,
            fields: [{ name: "id" }],
          },
        ],
      },
    );
  }
}
