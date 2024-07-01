import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type { activityLogs, activityLogsId } from "./activityLogs.js";

export interface appUserActionTypesAttributes {
  id: string;
  name?: string;
  prettyName?: string;
  createdAt: Date;
  updatedAt: Date;
}
export type appUserActionTypesPk = "id";
export type appUserActionTypesId = appUserActionTypes[appUserActionTypesPk];
export type appUserActionTypesOptionalAttributes = "id" | "name" | "prettyName" | "createdAt" | "updatedAt";
export type appUserActionTypesCreationAttributes = Optional<
  appUserActionTypesAttributes,
  appUserActionTypesOptionalAttributes
>;

export class appUserActionTypes
  extends Model<appUserActionTypesAttributes, appUserActionTypesCreationAttributes>
  implements appUserActionTypesAttributes
{
  id!: string;
  name?: string;
  prettyName?: string;
  createdAt!: Date;
  updatedAt!: Date;

  // appUserActionTypes hasMany activityLogs via action_id
  activity_logs!: activityLogs[];
  getActivity_logs!: Sequelize.HasManyGetAssociationsMixin<activityLogs>;
  setActivity_logs!: Sequelize.HasManySetAssociationsMixin<activityLogs, activityLogsId>;
  addActivity_log!: Sequelize.HasManyAddAssociationMixin<activityLogs, activityLogsId>;
  addActivity_logs!: Sequelize.HasManyAddAssociationsMixin<activityLogs, activityLogsId>;
  createActivity_log!: Sequelize.HasManyCreateAssociationMixin<activityLogs>;
  removeActivity_log!: Sequelize.HasManyRemoveAssociationMixin<activityLogs, activityLogsId>;
  removeActivity_logs!: Sequelize.HasManyRemoveAssociationsMixin<activityLogs, activityLogsId>;
  hasActivity_log!: Sequelize.HasManyHasAssociationMixin<activityLogs, activityLogsId>;
  hasActivity_logs!: Sequelize.HasManyHasAssociationsMixin<activityLogs, activityLogsId>;
  countActivity_logs!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof appUserActionTypes {
    return appUserActionTypes.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          unique: "app_user_action_types_unique",
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        prettyName: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: "pretty_name",
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
        tableName: "app_user_action_types",
        schema: "public",
        timestamps: false,
        indexes: [
          {
            name: "app_user_action_types_pkey",
            unique: true,
            fields: [{ name: "id" }],
          },
          {
            name: "app_user_action_types_unique",
            unique: true,
            fields: [{ name: "id" }],
          },
        ],
      },
    );
  }
}
