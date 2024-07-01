import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";

export interface inquiriesAttributes {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  message: string;
  createdAt?: Date;
  updatedAt?: Date;
  isSubscribe?: boolean;
}

export type inquiriesPk = "id";
export type inquiriesId = inquiries[inquiriesPk];
export type inquiriesOptionalAttributes = "id" | "phoneNumber" | "createdAt" | "updatedAt" | "isSubscribe";
export type inquiriesCreationAttributes = Optional<inquiriesAttributes, inquiriesOptionalAttributes>;

export class inquiries extends Model<inquiriesAttributes, inquiriesCreationAttributes> implements inquiriesAttributes {
  id!: string;
  name!: string;
  email!: string;
  phoneNumber?: string;
  message!: string;
  createdAt?: Date;
  updatedAt?: Date;
  isSubscribe?: boolean;

  static initModel(sequelize: Sequelize.Sequelize): typeof inquiries {
    return inquiries.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING(191),
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        phoneNumber: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: "phone_number",
        },
        message: {
          type: DataTypes.TEXT,
          allowNull: false,
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
        tableName: "inquiries",
        schema: "public",
        timestamps: false,
        indexes: [
          {
            name: "inquiries_pk",
            unique: true,
            fields: [{ name: "id" }],
          },
        ],
      },
    );
  }
}
