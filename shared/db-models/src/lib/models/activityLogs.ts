import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type { appModuleTypes, appModuleTypesId } from "./appModuleTypes.js";
import type { appUserActionTypes, appUserActionTypesId } from "./appUserActionTypes.js";
import type { users, usersId } from "./users.js";

export interface activityLogsAttributes {
  id: string;
  activityTime: Date;
  userId: string;
  details?: object;
  ipAddress?: string;
  userAgent?: string;
  actionReference?: string;
  actorType: "admin" | "user" | "moderator" | "super_admin";
  actionId: string;
  moduleId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type activityLogsPk = "id";
export type activityLogsId = activityLogs[activityLogsPk];
export type activityLogsOptionalAttributes =
  | "id"
  | "details"
  | "ipAddress"
  | "userAgent"
  | "actionReference"
  | "createdAt"
  | "updatedAt";
export type activityLogsCreationAttributes = Optional<activityLogsAttributes, activityLogsOptionalAttributes>;

export class activityLogs
  extends Model<activityLogsAttributes, activityLogsCreationAttributes>
  implements activityLogsAttributes
{
  id!: string;
  activityTime!: Date;
  userId!: string;
  details?: object;
  ipAddress?: string;
  userAgent?: string;
  actionReference?: string;
  actorType!: "admin" | "user" | "moderator" | "super_admin";
  actionId!: string;
  moduleId!: string;
  createdAt!: Date;
  updatedAt!: Date;

  // activityLogs belongsTo appModuleTypes via module_id
  module!: appModuleTypes;
  getModule!: Sequelize.BelongsToGetAssociationMixin<appModuleTypes>;
  setModule!: Sequelize.BelongsToSetAssociationMixin<appModuleTypes, appModuleTypesId>;
  createModule!: Sequelize.BelongsToCreateAssociationMixin<appModuleTypes>;
  // activityLogs belongsTo appUserActionTypes via action_id
  action!: appUserActionTypes;
  getAction!: Sequelize.BelongsToGetAssociationMixin<appUserActionTypes>;
  setAction!: Sequelize.BelongsToSetAssociationMixin<appUserActionTypes, appUserActionTypesId>;
  createAction!: Sequelize.BelongsToCreateAssociationMixin<appUserActionTypes>;
  // activityLogs belongsTo users via user_id
  user!: users;
  getUser!: Sequelize.BelongsToGetAssociationMixin<users>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<users, usersId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<users>;

  static initModel(sequelize: Sequelize.Sequelize): typeof activityLogs {
    return activityLogs.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          unique: "activity_logs_unique",
        },
        activityTime: {
          type: DataTypes.DATE,
          allowNull: false,
          field: "activity_time",
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
        details: {
          type: DataTypes.JSON,
          allowNull: true,
        },
        ipAddress: {
          type: DataTypes.INET,
          allowNull: true,
          field: "ip_address",
        },
        userAgent: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        actionReference: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: "action_reference",
        },
        actorType: {
          type: DataTypes.ENUM("admin", "user", "moderator", "super_admin"),
          allowNull: false,
          field: "actor_type",
        },
        actionId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: "app_user_action_types",
            key: "id",
          },
          field: "action_id",
        },
        moduleId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: "app_module_types",
            key: "id",
          },
          field: "module_id",
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
          field: "created_at",
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
        tableName: "activity_logs",
        schema: "public",
        timestamps: false,
        indexes: [
          {
            name: "activity_logs_pkey",
            unique: true,
            fields: [{ name: "id" }],
          },
          {
            name: "activity_logs_unique",
            unique: true,
            fields: [{ name: "id" }],
          },
        ],
      },
    );
  }
}
