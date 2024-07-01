import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type { activityLogs, activityLogsId } from "./activityLogs.js";

export interface appModuleTypesAttributes {
  id: string;
  name?: string;
  prettyName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type appModuleTypesPk = "id";
export type appModuleTypesId = appModuleTypes[appModuleTypesPk];
export type appModuleTypesOptionalAttributes = "id" | "name" | "prettyName" | "createdAt" | "updatedAt";
export type appModuleTypesCreationAttributes = Optional<appModuleTypesAttributes, appModuleTypesOptionalAttributes>;

export class appModuleTypes
  extends Model<appModuleTypesAttributes, appModuleTypesCreationAttributes>
  implements appModuleTypesAttributes
{
  id!: string;
  name?: string;
  prettyName?: string;
  createdAt!: Date;
  updatedAt!: Date;

  // appModuleTypes hasMany activityLogs via module_id
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

  static initModel(sequelize: Sequelize.Sequelize): typeof appModuleTypes {
    return appModuleTypes.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          unique: "app_module_types_unique",
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
        tableName: "app_module_types",
        schema: "public",
        timestamps: false,
        indexes: [
          {
            name: "app_module_types_pkey",
            unique: true,
            fields: [{ name: "id" }],
          },
          {
            name: "app_module_types_unique",
            unique: true,
            fields: [{ name: "id" }],
          },
        ],
      },
    );
  }
}
