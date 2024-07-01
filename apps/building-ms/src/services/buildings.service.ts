import type { models } from "@condo-server/db-models";
import { db, sq } from "@condo-server/db-models";
import { UUID } from "crypto";
import { HttpError } from "../errors/index.js";
import { paginatedResponse } from "../types";

class BuildingServices {
  getAllBuildings = async (query): Promise<paginatedResponse<Partial<models.buildingsAttributes>>> => {
    const page: number = parseInt(query.page as string, 10) || 1;
    const pageSize: number = parseInt(query.pageSize as string, 10) || 10;
    const offset = (page - 1) * pageSize;

    try {
      const { count, rows } = await db.buildings.findAndCountAll({
        offset,
        limit: pageSize,
        order: [["createdAt", "desc"]],
        include: [
          {
            model: db.geoHierarchy,
            as: "geo",
            attributes: [],
          },
        ],
        attributes: ["id", "name", "address", "buildingSlug", [sq.col("city"), "city"]],
      });

      return {
        totalItems: count,
        totalPages: Math.ceil(count / pageSize),
        currentPage: page,
        data: rows as unknown as models.buildingsAttributes,
      };
    } catch (error) {
      console.log(error);
      throw new HttpError(500, error.message);
    }
  };

  getBuilding = async (id: UUID): Promise<Partial<models.buildingsAttributes>> => {
    try {
      console.log(id);
      const building = db.buildings.findOne({
        where: {
          id,
        },
        attributes: [
          "id",
          "name",
          "address",
          "buildingSlug",
          "zip",
          "yearBuilt",
          "summary",
          "averagePsf",
          "hoaFees",
          "unitSizeRange",
          [sq.literal("array_length(units_for_sale, 1)"), "availableUnits"],
          [sq.literal("array_length(unit_ids, 1)"), "totalUnits"],
          "noOfStories",
          "lat",
          "long",
          "newConstruction",
          "waterfront",
          "accessType",
          "faq",
          "aboutProperty",
        ],
      });

      return building;
    } catch (error) {
      console.log(error);
      throw new HttpError(500, error.message);
    }
  };
}

export default new BuildingServices();
