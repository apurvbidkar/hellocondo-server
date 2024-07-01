import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type { users, usersId } from "./users.js";

export interface userDataPermissionAttributes {
  id: string;
  userId: string;
  objectId?: object;
  objectType?: string;
  createdBy?: string;
  createdAt: Date;
  updatedBy?: string;
  updatedAt: Date;
}

export type userDataPermissionPk = "id";
export type userDataPermissionId = userDataPermission[userDataPermissionPk];
export type userDataPermissionOptionalAttributes =
  | "id"
  | "objectId"
  | "objectType"
  | "createdBy"
  | "createdAt"
  | "updatedBy"
  | "updatedAt";
export type userDataPermissionCreationAttributes = Optional<
  userDataPermissionAttributes,
  userDataPermissionOptionalAttributes
>;

export class userDataPermission
  extends Model<userDataPermissionAttributes, userDataPermissionCreationAttributes>
  implements userDataPermissionAttributes
{
  id!: string;
  userId!: string;
  objectId?: object;
  objectType?: string;
  createdBy?: string;
  createdAt!: Date;
  updatedBy?: string;
  updatedAt!: Date;

  // userDataPermission belongsTo users via user_id
  user!: users;
  getUser!: Sequelize.BelongsToGetAssociationMixin<users>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<users, usersId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<users>;
  // userDataPermission belongsTo users via created_by
  created_by_user!: users;
  getCreated_by_user!: Sequelize.BelongsToGetAssociationMixin<users>;
  setCreated_by_user!: Sequelize.BelongsToSetAssociationMixin<users, usersId>;
  createCreated_by_user!: Sequelize.BelongsToCreateAssociationMixin<users>;
  // userDataPermission belongsTo users via updated_by
  updated_by_user!: users;
  getUpdated_by_user!: Sequelize.BelongsToGetAssociationMixin<users>;
  setUpdated_by_user!: Sequelize.BelongsToSetAssociationMixin<users, usersId>;
  createUpdated_by_user!: Sequelize.BelongsToCreateAssociationMixin<users>;

  static initModel(sequelize: Sequelize.Sequelize): typeof userDataPermission {
    return userDataPermission.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        userId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: "users",
            key: "id",
          },
          field: "user_id",
        },
        objectId: {
          type: DataTypes.JSONB,
          allowNull: true,
          field: "object_id",
        },
        objectType: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: "object_type",
        },
        createdBy: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: "users",
            key: "id",
          },
          field: "created_by",
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
          field: "created_at",
        },
        updatedBy: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: "users",
            key: "id",
          },
          field: "updated_by",
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
          field: "updated_at",
        },
      },
      {
        sequelize,
        tableName: "user_data_permission",
        schema: "public",
        timestamps: false,
        underscored: true,
        indexes: [
          {
            name: "identify_unique_rows",
            fields: [{ name: "user_id" }, { name: "object_id" }, { name: "object_type" }],
          },
          {
            name: "user_data_permission_pk",
            unique: true,
            fields: [{ name: "id" }],
          },
        ],
      },
    );
  }
}
