// import { Transaction, Optional } from "../config/db.js";
export interface Building {
  id: string;
  name: string;
  buildingSlug: string;
  county: string;
  state: string;
  city: string;
  zip: number;
  metro: string;
  neighbourhood: string;
  videoTourUrl: string | null;
  videos: string | null;
  images: string | null;
  imagesCount: number | null;
  videoCount: number | null;
  volume: number | null;
}

export interface BuildingsResponse {
  count: number;
  rows: Building[];
}

export interface UserBuildings {
  id: string;
  name: string;
  county: string | null;
  state: string | null;
  city: string | null;
  zip: number | null;
  metro: string | null;
  volume: number | null;
  neighbourhood?: string | null
}

export interface UserBuildingsResponse {
  count: number;
  rows: UserBuildings[];
}

export interface FilterDropdownQueryResponse {
  neighbourhood: string | null;
  zip: string | null;
  city: string | null;
  county: string | null;
  metro: string | null;
  state: string | null;
  buildingName: string | null;
}

// export interface BuildingMediaAttributes {
//   id: string;
//   bId: string;
//   images?: object;
//   videos?: object;
//   videoTourUrl?: object;
//   createdBy: string;
//   createdAt?: Date;
//   updatedBy: string;
//   updatedAt?: Date;
// }

// export type BuildingMediaCreationAttributes = Optional<BuildingMediaAttributes, 'id' |'bId' | 'images' | 'videos' | 'videoTourUrl' | 'createdAt' | 'updatedAt'>;

// export interface BuildingMediaInstance extends BuildingMediaAttributes {
//   update: (data: Partial<BuildingMediaAttributes>, options?: { transaction?: Transaction }) => Promise<void>;
// }
