import { sq } from "@condo-server/db-models";
export interface UserDataPermissionPayload {
  userId?: string;
  objectId: number[] | string[];
  objectType: string;
  removePermission: boolean;
  state?: string;
}

export interface UpdatedUserDataPermission {
  id: string;
  userId: string;
  objectType: string;
  objectId: string[];
  updatedBy?: string;
  createdBy?: string
}

export interface UserDataPermission {
  id: string;
  userId: string;
  objectType: string;
  objectId: string[];
  update: (data: Partial<UpdatedUserDataPermission>, options?: { transaction?: sq.Transaction }) => Promise<void>;
}

interface QueryResponseItem {
  objectId: string[];
}

export type PermittedBuildingsQueryResponse = QueryResponseItem[];

export interface ObjectId {
  state: string;
  metro?: string;
  county?: string;
  city?: string;
  zip?: string;
  neighbourhood?: string;
}

export interface UserDataLocationPermissionPayload {
  userId: string;
  objectId: ObjectId;
  objectType: string;
}

export interface UserDataLocationPermission {
  id: string;
  userId: string;
  objectType: string;
  objectId: string[];
  update: (data: Partial<UpdatedUserDataPermission>, options?: { transaction?: sq.Transaction }) => Promise<void>;
}

export interface DeleteUserDataLocationPermissionPayload {
  userId: string;
  objectId: ObjectId[];
  objectType: string;
}

export interface GetLocationsResponse {
  count : number,
  rows : ObjectId[]
}