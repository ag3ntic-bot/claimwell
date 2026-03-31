import type { User, AppSettings, NotificationItem } from '@/types';

export const mockUser: User = {
  id: 'usr_01',
  name: 'Alexander Vance',
  email: 'alexander.vance@curatedclaims.com',
  avatarUri: null,
  subscriptionTier: 'pro',
  createdAt: '2024-06-15T08:00:00Z',
};

export const mockSettings: AppSettings = {
  notifications: true,
  emailNotifications: true,
  biometricLock: false,
  darkMode: true,
};

export const mockNotifications: NotificationItem[] = [
  {
    id: 'notif_01',
    title: 'Appeal Deadline Approaching',
    body: 'You have 12 days left to submit your formal appeal for case #APL-99283. Claimwell has a draft ready for your review.',
    read: false,
    createdAt: '2024-10-30T08:00:00Z',
    claimId: 'clm_01',
  },
  {
    id: 'notif_02',
    title: 'New Evidence Analyzed',
    body: 'AI analysis complete for "Apple Support Chat Transcript." A contradiction was detected — the support agent reversed their position without justification. This strengthens your appeal.',
    read: false,
    createdAt: '2024-10-28T17:00:00Z',
    claimId: 'clm_01',
  },
  {
    id: 'notif_03',
    title: 'Claim Resolved — Sony WH-1000XM5',
    body: 'Congratulations! Sony has issued a full refund of $398.00 for your defective headphones. The funds should appear in your account within 3–5 business days.',
    read: true,
    createdAt: '2024-09-12T17:05:00Z',
    claimId: 'clm_04',
  },
];
