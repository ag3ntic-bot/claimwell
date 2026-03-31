export type TemplateCategory = 'refunds' | 'warranty' | 'subscription' | 'delivery' | 'appeals';

export interface Template {
  id: string;
  title: string;
  category: TemplateCategory;
  description: string;
  tags: string[];
  content: string;
  usageCount: number;
}

export const TEMPLATE_CATEGORY_META: Record<
  TemplateCategory,
  { label: string; icon: string; description: string; count: number }
> = {
  refunds: {
    label: 'Refunds & Reimbursements',
    icon: 'payments',
    description: 'Templates for requesting refunds and reimbursements from retailers and service providers.',
    count: 12,
  },
  warranty: {
    label: 'Warranty & Repairs',
    icon: 'build_circle',
    description: 'Claim templates for manufacturer warranties and repair disputes.',
    count: 8,
  },
  subscription: {
    label: 'Subscription Disputes',
    icon: 'cancel',
    description: 'Templates for subscription cancellations and billing disputes.',
    count: 6,
  },
  delivery: {
    label: 'Delivery & Shipping',
    icon: 'package_2',
    description: 'Templates for lost, damaged, or delayed deliveries.',
    count: 9,
  },
  appeals: {
    label: 'Appeals & Escalations',
    icon: 'gavel',
    description: 'Formal appeal letters and escalation templates for denied claims.',
    count: 7,
  },
};
