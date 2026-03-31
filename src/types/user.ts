export type SubscriptionTier = 'free' | 'pro';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUri: string | null;
  subscriptionTier: SubscriptionTier;
  createdAt: string;
}

export interface AppSettings {
  notifications: boolean;
  emailNotifications: boolean;
  biometricLock: boolean;
  darkMode: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  claimId: string | null;
}
