import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";

export interface speaktoAgentAttributes {
  id: string;
  inquiryType?: "Buying" | "Selling" | "Buying & Selling";
  userId?: string;
  address?: string;
  name: string;
  email: string;
  phoneNumber?: string;
  propertyType?: "Any" | "Condo" | "Townhouse";
  targetPrice?: string;
  additionalInfo?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isSubscribe?: boolean;
}

export type speaktoAgentPk = "id";
export type speaktoAgentId = speaktoAgent[speaktoAgentPk];
export type speaktoAgentOptionalAttributes =
  | "id"
  | "inquiryType"
  | "userId"
  | "address"
  | "phoneNumber"
  | "propertyType"
  | "targetPrice"
  | "additionalInfo"
  | "createdAt"
  | "updatedAt"
  | "isSubscribe";

export type speaktoAgentCreationAttributes = Optional<speaktoAgentAttributes, speaktoAgentOptionalAttributes>;

export class speaktoAgent
  extends Model<speaktoAgentAttributes, speaktoAgentCreationAttributes>
  implements speaktoAgentAttributes
{
  id!: string;
  inquiryType?: "Buying" | "Selling" | "Buying & Selling";
  userId?: string;
  address?: string;
  name!: string;
  email!: string;
  phoneNumber?: string;
  propertyType?: "Any" | "Condo" | "Townhouse";
  targetPrice?: string;
  additionalInfo?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isSubscribe?: boolean;

  static initModel(sequelize: Sequelize.Sequelize): typeof speaktoAgent {
    return speaktoAgent.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        inquiryType: {
          type: DataTypes.ENUM("Buying", "Selling", "Buying & Selling"),
          allowNull: true,
          field: "inquiry_type",
        },
        userId: {
          type: DataTypes.UUID,
          allowNull: true,
          field: "user_id",
        },
        address: {
          type: DataTypes.STRING(255),
          allowNull: true,
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
        propertyType: {
          type: DataTypes.ENUM("Any", "Condo", "Townhouse"),
          allowNull: true,
          field: "property_type",
        },
        targetPrice: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: "target_price",
        },
        additionalInfo: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: "additional_info",
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
        tableName: "speakto_agent",
        schema: "public",
        timestamps: false,
        indexes: [
          {
            name: "speakto_agent_pkey",
            unique: true,
            fields: [{ name: "id" }],
          },
        ],
      },
    );
  }
}
