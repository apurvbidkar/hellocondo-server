import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";

export interface subscribeAttributes {
  id: string;
  email: string;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  isSubscribe?: boolean;
}

export type subscribePk = "id";
export type subscribeId = subscribe[subscribePk];
export type subscribeOptionalAttributes = "id" | "active" | "createdAt" | "updatedAt" | "isSubscribe";
export type subscribeCreationAttributes = Optional<subscribeAttributes, subscribeOptionalAttributes>;

export class subscribe extends Model<subscribeAttributes, subscribeCreationAttributes> implements subscribeAttributes {
  id!: string;
  email!: string;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  isSubscribe?: boolean;

  static initModel(sequelize: Sequelize.Sequelize): typeof subscribe {
    return subscribe.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        email: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        active: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: true,
        },
        isSubscribe: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: true,
          field: "is_subscribe",
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
        tableName: "subscribe",
        schema: "public",
        timestamps: false,
        indexes: [
          {
            name: "subscribe_pkey",
            unique: true,
            fields: [{ name: "id" }],
          },
        ],
      },
    );
  }
}
