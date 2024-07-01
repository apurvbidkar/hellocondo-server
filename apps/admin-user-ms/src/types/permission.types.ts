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
export interface Permission {
  isRead: boolean;
  isWrite: boolean;
  isDelete: boolean;
}

export interface SectionPermissions {
  [sectionName: string]: Permission;
}

export type PermissionsArray = SectionPermissions[];
