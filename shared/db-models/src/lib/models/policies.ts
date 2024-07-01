import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type { groupPolicies, groupPoliciesId } from "./groupPolicies.js";
import type { users, usersId } from "./users.js";

export interface policiesAttributes {
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

export type policiesPk = "id";
export type policiesId = policies[policiesPk];
export type policiesOptionalAttributes =
  | "id"
  | "displayName"
  | "icon"
  | "key"
  | "createdBy"
  | "updatedAt"
  | "updatedBy"
  | "groupId";
export type policiesCreationAttributes = Optional<policiesAttributes, policiesOptionalAttributes>;

export class policies extends Model<policiesAttributes, policiesCreationAttributes> implements policiesAttributes {
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

  // policies belongsTo groupPolicies via groupId
  group!: groupPolicies;
  getGroup!: Sequelize.BelongsToGetAssociationMixin<groupPolicies>;
  setGroup!: Sequelize.BelongsToSetAssociationMixin<groupPolicies, groupPoliciesId>;
  createGroup!: Sequelize.BelongsToCreateAssociationMixin<groupPolicies>;
  // policies belongsTo users via updated_by
  updated_by_user!: users;
  getUpdated_by_user!: Sequelize.BelongsToGetAssociationMixin<users>;
  setUpdated_by_user!: Sequelize.BelongsToSetAssociationMixin<users, usersId>;
  createUpdated_by_user!: Sequelize.BelongsToCreateAssociationMixin<users>;

  static initModel(sequelize: Sequelize.Sequelize): typeof policies {
    return policies.init(
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
          field: "sequence_order",
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
          field: "created_at",
        },
        createdBy: {
          type: DataTypes.STRING(255),
          allowNull: false,
          defaultValue: "Automation Script",
          field: "created_by",
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: "updated_at",
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
        groupId: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: "group_policies",
            key: "id",
          },
          field: "group_id",
        },
      },
      {
        sequelize,
        tableName: "policies",
        schema: "public",
        timestamps: false,
        indexes: [
          {
            name: "policies_pk",
            unique: true,
            fields: [{ name: "id" }],
          },
          {
            name: "policies_pkey",
            unique: true,
            fields: [{ name: "id" }],
          },
        ],
      },
    );
  }
}
