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
