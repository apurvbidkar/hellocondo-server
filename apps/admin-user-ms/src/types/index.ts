import { Request } from "express";
import { UserPermissions } from "./permission.types";
import { UserWithRole } from "../viewModel/user.viewModel";

export interface UserContext extends UserWithRole {
  permissions: Array<UserPermissions>;
}

export interface RequestWithLoggedInUser extends Request {
  // TODO: Need to remove this any and replace with actual type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any;
  user: UserContext; // or the actual type of your user
}

/**
 * Interface for pagination query parameters.
 */
export interface PaginationQuery {
  page: number;
  limit: number;
}

export interface UserRegister {
  name: string;
  email: string;
  phoneNumber: string;
  roleId: string;
  description: string;
  permissions: Array<Omit<UserPermissions, "subPermissions">>;
}

export interface CognitoSignUpRequest {
  name: string;
  email: string;
  password: string;
}

export interface CognitoSignUpResponse {
  UserConfirmed: boolean;
  UserSub: string;
}

export type UserLoginReqBody = {
  email: string;
  password: string;
};

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export enum UserRoles {
  Admin = "admin",
  User = "user",
  SuperAdmin = "Super Admin",
}

export enum resStatusType {
  Success = "success",
  Failed = "failed",
}

export enum Section {
  USER_MANAGEMENT = "user_management",
  MANAGE_BUILDINGS = "manage_buildings",
  MANAGE_BUILDING_MEDIA = "manage_building_media",
  MANAGE_BUILDING_DATA = "manage_building_data",
}

export enum Action {
  READ = "read",
  WRITE = "write",
  DELETE = "delete",
}

export interface GlobalResponse {
  status: resStatusType;
  message: string;
  data?: unknown;
}

export interface GlobalResponseSuccess extends GlobalResponse {
  status: resStatusType.Success;
}

export interface GlobalResponseFailed extends GlobalResponse {
  status: resStatusType.Failed;
}

export interface ForgetPasswordRequest {
  email: string;
  newPassword: string;
  confirmationCode: string;
}

export interface UserUpdate extends UserRegister {
  id: string;
}

export interface RoleWithPermissions {
  id: string;
  roleName: string;
  permissions: Array<UserPermissions>;
}
