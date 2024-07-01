export interface GetBuildingsFilterParams {
  name?: string;
  state?: string;
  city?: string;
  metro?: string;
  neighbourhood?: string;
  zip?: number;
  county?: string;
}

export interface GetBuildingsParams {
  page?: number;
  limit?: number;
  userId?: string;
  filters?: GetBuildingsFilterParams;
}

export interface FilterConditionForGetBuildings {
  [key: string]: any;
}

export interface getAssignedBuildingsForUserParams {
  page?: number;
  limit?: number;
  userId?: string;
}
export interface DropdownFilterValuesParams {
  state?: string;
  city?: string;
  metro?: string;
  neighbourhood?: string;
  zip?: number;
  county?: string;
}

export interface DropdownValuesFilterParams {
  filters?: DropdownFilterValuesParams;
}

export interface FilterDropdownResponse {
  zip?: string[];
  buildingname?: string[];
  state?: string[];
  city?: string[];
  county?: string[];
  neighbourhood?: string[];
  metro?: string[];
}

export interface MediaCoverageQueryParams {
  filters?: GetBuildingsFilterParams;
}

interface MediaCoverageQueryResponseItem {
  images: string;
  videos: string;
  links: string;
}

export interface MediaCoverageQueryResponse {
  count: number;
  rows: MediaCoverageQueryResponseItem[];
}

export interface MediaCounts {
  imagesCount: number;
  videosCount: number;
  linksCount: number;
  totalMediaCount: number;
  remainingMediaCount: number;
}

export interface QueryWithReplacements {
  query: string;
  replacements: Record<string, string | number | null>;
}

export interface Media {
  id: string;
  seqNo: number;
  imageUrl: string;
  thumbUrl: string;
}

export interface DeletedMedia {
  id: string;
  imageUrl: string;
  thumbUrl: string;
}

export interface Video {
  id: string;
  seqNo: number;
  videoUrl: string;
  thumbUrl: string;
}

export interface DeletedVideo {
  id: string;
  videoUrl: string;
  thumbUrl: string;
}

export interface UploadBuildingMediaParamsType {
  bId: string;
  images: Media[];
  newImages?: Media[];
  deletedImages?: DeletedMedia[];
  videos?: Video[];
  newVideos?: Video[];
  deletedVideos?: DeletedVideo[];
  videoTourUrl?: string[];
}