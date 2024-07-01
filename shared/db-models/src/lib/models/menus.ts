import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";

export interface menusAttributes {
  id: string;
  seqNo: number;
  name: string;
  displayName: string;
  type: "parent" | "child";
  childOf: string;
}

export type menusPk = "id";
export type menusId = menus[menusPk];
export type menusOptionalAttributes = "id";
export type menusCreationAttributes = Optional<menusAttributes, menusOptionalAttributes>;

export class menus extends Model<menusAttributes, menusCreationAttributes> implements menusAttributes {
  id!: string;
  seqNo!: number;
  name!: string;
  displayName!: string;
  type!: "parent" | "child";
  childOf!: string;

  // menus belongsTo menus via child_of
  child_of_menu!: menus;
  getChild_of_menu!: Sequelize.BelongsToGetAssociationMixin<menus>;
  setChild_of_menu!: Sequelize.BelongsToSetAssociationMixin<menus, menusId>;
  createChild_of_menu!: Sequelize.BelongsToCreateAssociationMixin<menus>;

  static initModel(sequelize: Sequelize.Sequelize): typeof menus {
    return menus.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        seqNo: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          field: "seq_no",
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        displayName: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: "display_name",
        },
        type: {
          type: DataTypes.ENUM("parent", "child"),
          allowNull: false,
        },
        childOf: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: "menus",
            key: "id",
          },
          field: "child_of",
        },
      },
      {
        sequelize,
        tableName: "menus",
        schema: "public",
        timestamps: false,
        indexes: [
          {
            name: "menus_pk",
            unique: true,
            fields: [{ name: "id" }],
          },
        ],
      },
    );
  }
}
