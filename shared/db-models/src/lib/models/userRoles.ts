import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type { users, usersId } from "./users.js";

export interface userRolesAttributes {
  id: string;
  roleName: string;
  isAdmin?: boolean;
  defaultPermission?: object;
  createdAt?: Date;
}

export type userRolesPk = "id";
export type userRolesId = userRoles[userRolesPk];
export type userRolesOptionalAttributes = "id" | "isAdmin" | "defaultPermission" | "createdAt";
export type userRolesCreationAttributes = Optional<userRolesAttributes, userRolesOptionalAttributes>;

export class userRoles extends Model<userRolesAttributes, userRolesCreationAttributes> implements userRolesAttributes {
  id!: string;
  roleName!: string;
  isAdmin?: boolean;
  defaultPermission?: object;
  createdAt?: Date;

  // userRoles hasOne users via id
  user!: users;
  getUser!: Sequelize.HasOneGetAssociationMixin<users>;
  setUser!: Sequelize.HasOneSetAssociationMixin<users, usersId>;
  createUser!: Sequelize.HasOneCreateAssociationMixin<users>;

  static initModel(sequelize: Sequelize.Sequelize): typeof userRoles {
    return userRoles.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        roleName: {
          type: DataTypes.STRING(44),
          allowNull: false,
          field: "role_name",
        },
        isAdmin: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: true,
          field: "is_admin",
        },
        defaultPermission: {
          type: DataTypes.JSONB,
          allowNull: true,
          field: "default_permission",
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: "created_at",
        },
      },
      {
        sequelize,
        tableName: "user_roles",
        schema: "public",
        timestamps: false,
        indexes: [
          {
            name: "user_roles_pk",
            unique: true,
            fields: [{ name: "id" }],
          },
        ],
      },
    );
  }
}
