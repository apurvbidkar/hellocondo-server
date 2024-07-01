interface AmenitiesAndPoliciesCheck {
  id: string;
  name: string;
  groupId: string | null;
  groupName: string | null;
}

export type AmenitiesAndPoliciesCheckResponse = AmenitiesAndPoliciesCheck[];

export interface AmenitiesPoliciesGroup {
  id: string;
  createdAt?: Date | string | null;
  name?: string;
  displayName?: string | null;
  icon?: string | null;
  sequenceOrder?: number;
  createdBy?: string;
  updatedAt: Date | null;
  updatedBy: string | null;
  deletedAt: Date | null;
  deletedBy: string | null;
}
export interface CreateGroupResponse {
  createGroupResponse: AmenitiesPoliciesGroup;
  task : string
}

export interface ListAmenityAndPolicyResponses {
  id: string;
  name: string;
  displayName: string;
  icon: string | null;
  sequenceOrder: number;
  status: string;
  key?: string;
  groupId?: string | null;
  groupName?: string | null;
  groupDisplayName?: string | null;
  groupIcon?: string | null;
  groupSequenceOrder?: number | null;
}
