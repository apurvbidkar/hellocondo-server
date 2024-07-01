import { Menu } from "./menu.viewModel";

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
