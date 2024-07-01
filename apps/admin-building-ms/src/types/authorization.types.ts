import { Request } from "express";
export enum Action {
  READ = "read",
  WRITE = "write",
  DELETE = "delete",
}

export enum resStatusType {
  Success = "success",
  Failed = "failed",
}

export interface SubPermission {
  menuId: string;
  section: string;
  displayName: string;
  isRead: boolean;
  isWrite: boolean;
  isDelete: boolean;
  subPermissions: SubPermission[];
}

export interface UserPermissions {
  menuId: string;
  section: string;
  displayName: string;
  isRead: boolean;
  isWrite: boolean;
  isDelete: boolean;
  subPermissions: SubPermission[];
}

export enum Section {
  USER_MANAGEMENT = "user_management",
  MANAGE_BUILDINGS = "manage_buildings",
  MANAGE_BUILDING_MEDIA = "manage_building_media",
  MANAGE_BUILDING_DATA = "manage_building_data",
  MANAGE_AMENITIES = 'manage_amenities'
}

// export interface SubPermission {
//   menuId: string;
//   section: string;
//   displayName: string;
//   isRead: boolean;
//   isWrite: boolean;
//   isDelete: boolean;
//   subPermissions: SubPermission[];
// }
/**
 * Represents a menu item.
 */
export interface Menu {
  id: string;
  seqNo: number;
  name: string;
  displayName: string;
  type: string;
  childOf: string | null;
}

/**
 * Represents the permissions and metadata for a user with respect to a menu item.
 */
export interface UserMenuPermission {
  id: string;
  userId: string;
  menuId: string;
  isRead: boolean;
  isWrite: boolean;
  isDelete: boolean;
  createdAt: string;
  updatedAt: string;
  menu: Menu;
}

export interface UserWithRole {
  id: string;
  name: string;
  email: string;
  isPasswordReset: boolean;
  roleName: string;
  isAdmin: boolean;
}

export interface UserPermissions {
  id?: string;
  menuId: string;
  section: string;
  displayName: string;
  isRead: boolean;
  isWrite: boolean;
  isDelete: boolean;
  subPermissions: SubPermission[];
}
export interface UserContext extends UserWithRole {
  permissions: Array<UserPermissions>;
}

export interface RequestWithLoggedInUser extends Request {
  // TODO: Need to remove this any and replace with actual type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any;
  user: UserContext; // or the actual type of your user
}

export interface Jwk {
  kid: string;
  kty: "RSA";
  n: string;
  e: string;
}
