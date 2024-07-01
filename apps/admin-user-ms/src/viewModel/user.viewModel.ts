/**
 * Represents a user along with their role information.
 */
export interface UserWithRole {
  id: string;
  name: string;
  email: string;
  isPasswordReset: boolean;
  roleName: string;
  isAdmin: boolean;
}

interface Permission {
  is_read: boolean;
  is_write: boolean;
  is_delete: boolean;
}

interface DefaultPermission {
  user_management: Permission;
  manage_buildings: Permission;
  manage_building_data: Permission;
  manage_building_media: Permission;
}

interface Role {
  id: string;
  roleName: string;
  isAdmin: boolean;
  defaultPermission: DefaultPermission[];
  createdAt: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  roleId: string;
  isActive: boolean;
  roleName: string;
  role: Role;
  description?: string | null;
}

export interface GetUsersResponse {
  count: number;
  rows: User[];
}
