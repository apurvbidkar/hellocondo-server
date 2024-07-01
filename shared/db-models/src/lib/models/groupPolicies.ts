import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type { policies, policiesId } from "./policies.js";

export interface groupPoliciesAttributes {
  id: string;
  name: string;
  displayName?: string;
  icon?: string;
  sequenceOrder: number;
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
  deletedAt?: Date;
  deletedBy?: string;
}

export type groupPoliciesPk = "id";
export type groupPoliciesId = groupPolicies[groupPoliciesPk];
export type groupPoliciesOptionalAttributes =
  | "id"
  | "displayName"
  | "icon"
  | "createdAt"
  | "updatedAt"
  | "updatedBy"
  | "deletedAt"
  | "deletedBy";
export type groupPoliciesCreationAttributes = Optional<groupPoliciesAttributes, groupPoliciesOptionalAttributes>;

export class groupPolicies
  extends Model<groupPoliciesAttributes, groupPoliciesCreationAttributes>
  implements groupPoliciesAttributes
{
  id!: string;
  name!: string;
  displayName?: string;
  icon?: string;
  sequenceOrder!: number;
  createdAt!: Date;
  createdBy!: string;
  updatedAt?: Date;
  updatedBy?: string;
  deletedAt?: Date;
  deletedBy?: string;

  // groupPolicies hasMany policies via group_id
  policies!: policies[];
  getPolicies!: Sequelize.HasManyGetAssociationsMixin<policies>;
  setPolicies!: Sequelize.HasManySetAssociationsMixin<policies, policiesId>;
  addPolicy!: Sequelize.HasManyAddAssociationMixin<policies, policiesId>;
  addPolicies!: Sequelize.HasManyAddAssociationsMixin<policies, policiesId>;
  createPolicy!: Sequelize.HasManyCreateAssociationMixin<policies>;
  removePolicy!: Sequelize.HasManyRemoveAssociationMixin<policies, policiesId>;
  removePolicies!: Sequelize.HasManyRemoveAssociationsMixin<policies, policiesId>;
  hasPolicy!: Sequelize.HasManyHasAssociationMixin<policies, policiesId>;
  hasPolicies!: Sequelize.HasManyHasAssociationsMixin<policies, policiesId>;
  countPolicies!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof groupPolicies {
    return groupPolicies.init(
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
          unique: "group_policies_name_key",
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
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
          field: "created_at",
        },
        createdBy: {
          type: DataTypes.UUID,
          allowNull: false,
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
          field: "updated_by",
        },
        deletedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: "deleted_at",
        },
        deletedBy: {
          type: DataTypes.UUID,
          allowNull: true,
          field: "deleted_by",
        },
      },
      {
        sequelize,
        tableName: "group_policies",
        schema: "public",
        timestamps: false,
        indexes: [
          {
            name: "group_policies_name_key",
            unique: true,
            fields: [{ name: "name" }],
          },
          {
            name: "group_policies_pkey",
            unique: true,
            fields: [{ name: "id" }],
          },
        ],
      },
    );
  }
}
