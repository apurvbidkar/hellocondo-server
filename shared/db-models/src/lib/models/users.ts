import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type { activityLogs, activityLogsId } from "./activityLogs.js";
import type { buildingMedia, buildingMediaId } from "./buildingMedia.js";
import type { buildings, buildingsId } from "./buildings.js";
import type { menuPermissions, menuPermissionsId } from "./menuPermissions.js";
import type { userRoles, userRolesId } from "./userRoles.js";

export interface usersAttributes {
  id: string;
  iamId?: string;
  name: string;
  email: string;
  roleId: string;
  phoneNumber?: string;
  description?: string;
  profileImageUrl?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  lastLogin?: Date;
  isPasswordReset?: boolean;
  lastPasswordReset?: Date;
  isActive?: boolean;
  isDelete?: boolean;
  createdVia?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  createdBy: string;
  updatedBy: string;
  deletedBy?: string;
}

export type usersPk = "id";
export type usersId = users[usersPk];
export type usersOptionalAttributes =
  | "id"
  | "iamId"
  | "phoneNumber"
  | "description"
  | "profileImageUrl"
  | "emailVerified"
  | "phoneVerified"
  | "lastLogin"
  | "isPasswordReset"
  | "lastPasswordReset"
  | "isActive"
  | "isDelete"
  | "createdVia"
  | "createdAt"
  | "updatedAt"
  | "deletedAt"
  | "deletedBy";

export type usersCreationAttributes = Optional<usersAttributes, usersOptionalAttributes>;

export class users extends Model<usersAttributes, usersCreationAttributes> implements usersAttributes {
  id!: string;
  iamId?: string;
  name!: string;
  email!: string;
  roleId!: string;
  phoneNumber?: string;
  description?: string;
  profileImageUrl?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  lastLogin?: Date;
  isPasswordReset?: boolean;
  lastPasswordReset?: Date;
  isActive?: boolean;
  isDelete?: boolean;
  createdVia?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  createdBy!: string;
  updatedBy!: string;
  deletedBy?: string;

  // users belongsTo userRoles via id
  id_user_role!: userRoles;
  getId_user_role!: Sequelize.BelongsToGetAssociationMixin<userRoles>;
  setId_user_role!: Sequelize.BelongsToSetAssociationMixin<userRoles, userRolesId>;
  createId_user_role!: Sequelize.BelongsToCreateAssociationMixin<userRoles>;
  // users hasMany activityLogs via user_id
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
  // users hasMany buildingMedia via created_by
  building_media!: buildingMedia[];
  getBuilding_media!: Sequelize.HasManyGetAssociationsMixin<buildingMedia>;
  setBuilding_media!: Sequelize.HasManySetAssociationsMixin<buildingMedia, buildingMediaId>;
  addBuilding_medium!: Sequelize.HasManyAddAssociationMixin<buildingMedia, buildingMediaId>;
  addBuilding_media!: Sequelize.HasManyAddAssociationsMixin<buildingMedia, buildingMediaId>;
  createBuilding_medium!: Sequelize.HasManyCreateAssociationMixin<buildingMedia>;
  removeBuilding_medium!: Sequelize.HasManyRemoveAssociationMixin<buildingMedia, buildingMediaId>;
  removeBuilding_media!: Sequelize.HasManyRemoveAssociationsMixin<buildingMedia, buildingMediaId>;
  hasBuilding_medium!: Sequelize.HasManyHasAssociationMixin<buildingMedia, buildingMediaId>;
  hasBuilding_media!: Sequelize.HasManyHasAssociationsMixin<buildingMedia, buildingMediaId>;
  countBuilding_media!: Sequelize.HasManyCountAssociationsMixin;
  // users hasMany buildingMedia via updated_by
  updated_by_building_media!: buildingMedia[];
  getUpdated_by_building_media!: Sequelize.HasManyGetAssociationsMixin<buildingMedia>;
  setUpdated_by_building_media!: Sequelize.HasManySetAssociationsMixin<buildingMedia, buildingMediaId>;
  addUpdated_by_building_medium!: Sequelize.HasManyAddAssociationMixin<buildingMedia, buildingMediaId>;
  addUpdated_by_building_media!: Sequelize.HasManyAddAssociationsMixin<buildingMedia, buildingMediaId>;
  createUpdated_by_building_medium!: Sequelize.HasManyCreateAssociationMixin<buildingMedia>;
  removeUpdated_by_building_medium!: Sequelize.HasManyRemoveAssociationMixin<buildingMedia, buildingMediaId>;
  removeUpdated_by_building_media!: Sequelize.HasManyRemoveAssociationsMixin<buildingMedia, buildingMediaId>;
  hasUpdated_by_building_medium!: Sequelize.HasManyHasAssociationMixin<buildingMedia, buildingMediaId>;
  hasUpdated_by_building_media!: Sequelize.HasManyHasAssociationsMixin<buildingMedia, buildingMediaId>;
  countUpdated_by_building_media!: Sequelize.HasManyCountAssociationsMixin;
  // users hasMany buildings via created_by
  buildings!: buildings[];
  getBuildings!: Sequelize.HasManyGetAssociationsMixin<buildings>;
  setBuildings!: Sequelize.HasManySetAssociationsMixin<buildings, buildingsId>;
  addBuilding!: Sequelize.HasManyAddAssociationMixin<buildings, buildingsId>;
  addBuildings!: Sequelize.HasManyAddAssociationsMixin<buildings, buildingsId>;
  createBuilding!: Sequelize.HasManyCreateAssociationMixin<buildings>;
  removeBuilding!: Sequelize.HasManyRemoveAssociationMixin<buildings, buildingsId>;
  removeBuildings!: Sequelize.HasManyRemoveAssociationsMixin<buildings, buildingsId>;
  hasBuilding!: Sequelize.HasManyHasAssociationMixin<buildings, buildingsId>;
  hasBuildings!: Sequelize.HasManyHasAssociationsMixin<buildings, buildingsId>;
  countBuildings!: Sequelize.HasManyCountAssociationsMixin;
  // users hasMany buildings via updated_by
  updated_by_buildings!: buildings[];
  getUpdated_by_buildings!: Sequelize.HasManyGetAssociationsMixin<buildings>;
  setUpdated_by_buildings!: Sequelize.HasManySetAssociationsMixin<buildings, buildingsId>;
  addUpdated_by_building!: Sequelize.HasManyAddAssociationMixin<buildings, buildingsId>;
  addUpdated_by_buildings!: Sequelize.HasManyAddAssociationsMixin<buildings, buildingsId>;
  createUpdated_by_building!: Sequelize.HasManyCreateAssociationMixin<buildings>;
  removeUpdated_by_building!: Sequelize.HasManyRemoveAssociationMixin<buildings, buildingsId>;
  removeUpdated_by_buildings!: Sequelize.HasManyRemoveAssociationsMixin<buildings, buildingsId>;
  hasUpdated_by_building!: Sequelize.HasManyHasAssociationMixin<buildings, buildingsId>;
  hasUpdated_by_buildings!: Sequelize.HasManyHasAssociationsMixin<buildings, buildingsId>;
  countUpdated_by_buildings!: Sequelize.HasManyCountAssociationsMixin;
  // users hasMany buildings via deleted_by
  deleted_by_buildings!: buildings[];
  getDeleted_by_buildings!: Sequelize.HasManyGetAssociationsMixin<buildings>;
  setDeleted_by_buildings!: Sequelize.HasManySetAssociationsMixin<buildings, buildingsId>;
  addDeleted_by_building!: Sequelize.HasManyAddAssociationMixin<buildings, buildingsId>;
  addDeleted_by_buildings!: Sequelize.HasManyAddAssociationsMixin<buildings, buildingsId>;
  createDeleted_by_building!: Sequelize.HasManyCreateAssociationMixin<buildings>;
  removeDeleted_by_building!: Sequelize.HasManyRemoveAssociationMixin<buildings, buildingsId>;
  removeDeleted_by_buildings!: Sequelize.HasManyRemoveAssociationsMixin<buildings, buildingsId>;
  hasDeleted_by_building!: Sequelize.HasManyHasAssociationMixin<buildings, buildingsId>;
  hasDeleted_by_buildings!: Sequelize.HasManyHasAssociationsMixin<buildings, buildingsId>;
  countDeleted_by_buildings!: Sequelize.HasManyCountAssociationsMixin;
  // users hasMany menuPermissions via menu_id
  menu_permissions!: menuPermissions[];
  getMenu_permissions!: Sequelize.HasManyGetAssociationsMixin<menuPermissions>;
  setMenu_permissions!: Sequelize.HasManySetAssociationsMixin<menuPermissions, menuPermissionsId>;
  addMenu_permission!: Sequelize.HasManyAddAssociationMixin<menuPermissions, menuPermissionsId>;
  addMenu_permissions!: Sequelize.HasManyAddAssociationsMixin<menuPermissions, menuPermissionsId>;
  createMenu_permission!: Sequelize.HasManyCreateAssociationMixin<menuPermissions>;
  removeMenu_permission!: Sequelize.HasManyRemoveAssociationMixin<menuPermissions, menuPermissionsId>;
  removeMenu_permissions!: Sequelize.HasManyRemoveAssociationsMixin<menuPermissions, menuPermissionsId>;
  hasMenu_permission!: Sequelize.HasManyHasAssociationMixin<menuPermissions, menuPermissionsId>;
  hasMenu_permissions!: Sequelize.HasManyHasAssociationsMixin<menuPermissions, menuPermissionsId>;
  countMenu_permissions!: Sequelize.HasManyCountAssociationsMixin;
  // users belongsTo users via created_by
  created_by_user!: users;
  getCreated_by_user!: Sequelize.BelongsToGetAssociationMixin<users>;
  setCreated_by_user!: Sequelize.BelongsToSetAssociationMixin<users, usersId>;
  createCreated_by_user!: Sequelize.BelongsToCreateAssociationMixin<users>;
  // users belongsTo users via updated_by
  updated_by_user!: users;
  getUpdated_by_user!: Sequelize.BelongsToGetAssociationMixin<users>;
  setUpdated_by_user!: Sequelize.BelongsToSetAssociationMixin<users, usersId>;
  createUpdated_by_user!: Sequelize.BelongsToCreateAssociationMixin<users>;
  // users belongsTo users via deleted_by
  deleted_by_user!: users;
  getDeleted_by_user!: Sequelize.BelongsToGetAssociationMixin<users>;
  setDeleted_by_user!: Sequelize.BelongsToSetAssociationMixin<users, usersId>;
  createDeleted_by_user!: Sequelize.BelongsToCreateAssociationMixin<users>;

  static initModel(sequelize: Sequelize.Sequelize): typeof users {
    return users.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          unique: "users_unique",
        },
        iamId: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: "iam_id",
        },
        name: {
          type: DataTypes.STRING(191),
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING(255),
          allowNull: false,
          unique: "users_unique_1",
        },
        roleId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: "user_roles",
            key: "id",
          },
          field: "role_id",
        },
        phoneNumber: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: "phone_number",
        },
        description: {
          type: DataTypes.STRING(300),
          allowNull: true,
        },
        profileImageUrl: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: "profile_image_url",
        },
        emailVerified: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: false,
          field: "email_verified",
        },
        phoneVerified: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: false,
          field: "phone_verified",
        },
        lastLogin: {
          type: DataTypes.DATE,
          allowNull: true,
          field: "last_login",
        },
        isPasswordReset: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: false,
          field: "is_password_reset",
        },
        lastPasswordReset: {
          type: DataTypes.DATE,
          allowNull: true,
          field: "last_password_reset",
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: true,
          field: "is_active",
        },
        isDelete: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: false,
          field: "is_delete",
        },
        createdVia: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: "created_via",
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: Sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
          field: "created_at",
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: Sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
          field: "updated_at",
        },
        deletedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: "deleted_at",
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
        updatedBy: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: "users",
            key: "id",
          },
          field: "updated_by",
        },
        deletedBy: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: "users",
            key: "id",
          },
          field: "deleted_by",
        },
      },
      {
        sequelize,
        tableName: "users",
        schema: "public",
        timestamps: false,
        indexes: [
          {
            name: "users_pk",
            unique: true,
            fields: [{ name: "id" }],
          },
          {
            name: "users_unique",
            unique: true,
            fields: [{ name: "id" }],
          },
          {
            name: "users_unique_1",
            unique: true,
            fields: [{ name: "email" }],
          },
        ],
      },
    );
  }
}
