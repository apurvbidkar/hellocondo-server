import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type { users, usersId } from "./users.js";

export interface menuPermissionsAttributes {
  id: string;
  userId: string;
  menuId: string;
  isRead?: boolean;
  isWrite?: boolean;
  isDelete?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type menuPermissionsPk = "id";
export type menuPermissionsId = menuPermissions[menuPermissionsPk];
export type menuPermissionsOptionalAttributes = "id" | "isRead" | "isWrite" | "isDelete" | "createdAt" | "updatedAt";
export type menuPermissionsCreationAttributes = Optional<menuPermissionsAttributes, menuPermissionsOptionalAttributes>;

export class menuPermissions
  extends Model<menuPermissionsAttributes, menuPermissionsCreationAttributes>
  implements menuPermissionsAttributes
{
  id!: string;
  userId!: string;
  menuId!: string;
  isRead?: boolean;
  isWrite?: boolean;
  isDelete?: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  // menuPermissions belongsTo users via menu_id
  menu!: users;
  getMenu!: Sequelize.BelongsToGetAssociationMixin<users>;
  setMenu!: Sequelize.BelongsToSetAssociationMixin<users, usersId>;
  createMenu!: Sequelize.BelongsToCreateAssociationMixin<users>;

  static initModel(sequelize: Sequelize.Sequelize): typeof menuPermissions {
    return menuPermissions.init(
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
        menuId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: "menus",
            key: "id",
          },
          field: "menu_id",
        },
        isRead: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: false,
          field: "is_read",
        },
        isWrite: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: false,
          field: "is_write",
        },
        isDelete: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: false,
          field: "is_delete",
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
      },
      {
        sequelize,
        tableName: "menu_permissions",
        schema: "public",
        timestamps: false,
        indexes: [
          {
            name: "menu_permissions_pk",
            unique: true,
            fields: [{ name: "id" }],
          },
        ],
      },
    );
  }
}
