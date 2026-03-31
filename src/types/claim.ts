export type ClaimStatus =
  | 'draft'
  | 'submitted'
  | 'in_progress'
  | 'reviewing'
  | 'appealing'
  | 'resolved'
  | 'archived';

export type ClaimCategory = 'refund' | 'warranty' | 'subscription' | 'delivery' | 'other';

export type ClaimStrength = 'low' | 'medium' | 'high';

export interface Claim {
  id: string;
  userId: string;
  title: string;
  category: ClaimCategory;
  companyName: string;
  status: ClaimStatus;
  strength: number;
  strengthLabel: ClaimStrength;
  amountClaimed: number;
  amountRecovered: number | null;
  resolutionProgress: number;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
  caseId: string;
  description: string;
  policyNumber: string | null;
  serialNumber: string | null;
}

export interface ClaimSummary {
  activeClaims: number;
  moneyAtStake: number;
  totalRecovered: number;
}

export const CLAIM_CATEGORY_META: Record<
  ClaimCategory,
  { label: string; icon: string; description: string }
> = {
  refund: {
    label: 'Refund or Reimbursement',
    icon: 'payments',
    description: 'Request money back for a product or service',
  },
  warranty: {
    label: 'Warranty Claim',
    icon: 'verified',
    description: 'Claim under manufacturer or extended warranty',
  },
  subscription: {
    label: 'Subscription Dispute',
    icon: 'calendar_today',
    description: 'Cancel, dispute charges, or request credits',
  },
  delivery: {
    label: 'Delivery Issue',
    icon: 'local_shipping',
    description: 'Missing, damaged, or late delivery',
  },
  other: {
    label: 'Other',
    icon: 'help',
    description: 'Any other type of claim or dispute',
  },
};

export const CLAIM_STATUS_META: Record<
  ClaimStatus,
  { label: string; variant: 'primary' | 'tertiary' | 'error' | 'secondary' }
> = {
  draft: { label: 'Draft', variant: 'secondary' },
  submitted: { label: 'Submitted', variant: 'primary' },
  in_progress: { label: 'In Progress', variant: 'tertiary' },
  reviewing: { label: 'Reviewing', variant: 'primary' },
  appealing: { label: 'Appealing', variant: 'tertiary' },
  resolved: { label: 'Resolved', variant: 'primary' },
  archived: { label: 'Archived', variant: 'secondary' },
};
