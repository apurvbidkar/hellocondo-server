export interface AmenityAndPolicy {
  id: string;
  sequenceOrder: number;
}

export interface GroupAmenityAndPolicyParams {
  name: string;
  displayName?: string;
  sequenceOrder: number;
  process: boolean;
  items: AmenityAndPolicy[] | null;
  icon?: string;
}

export interface listItemsParams {
  flag?: boolean
}