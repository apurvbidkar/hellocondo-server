import type { Sequelize } from "sequelize";
import type { neighborhoods2NAttributes, neighborhoods2NCreationAttributes } from "./neighborhoods2N.js";
import { neighborhoods2N as _neighborhoods2N } from "./neighborhoods2N.js";
import type { searchLocationsAttributes, searchLocationsCreationAttributes } from "./searchLocations.js";
import { searchLocations as _searchLocations } from "./searchLocations.js";
import type { zipCodeBoundariesAttributes, zipCodeBoundariesCreationAttributes } from "./zipCodeBoundaries.js";
import { zipCodeBoundaries as _zipCodeBoundaries } from "./zipCodeBoundaries.js";

export {
  _neighborhoods2N as neighborhoods2N,
  _searchLocations as searchLocations,
  _zipCodeBoundaries as zipCodeBoundaries,
};

export type {
  neighborhoods2NAttributes,
  neighborhoods2NCreationAttributes,
  searchLocationsAttributes,
  searchLocationsCreationAttributes,
  zipCodeBoundariesAttributes,
  zipCodeBoundariesCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const searchLocations = _searchLocations.initModel(sequelize);
  const neighborhoods2N = _neighborhoods2N.initModel(sequelize);
  const zipCodeBoundaries = _zipCodeBoundaries.initModel(sequelize);

  return {
    neighborhoods2N: neighborhoods2N,
    searchLocations: searchLocations,
    zipCodeBoundaries: zipCodeBoundaries,
  };
}
