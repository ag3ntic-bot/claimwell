/**
 * Profile & Settings Screen
 *
 * User profile hero with avatar, account management settings,
 * data & support links, and sign out action.
 */

import React, { useState, useCallback } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import {
  Avatar,
  Badge,
  Icon,
  CardSkeleton,
  ErrorState,
} from '@/components/ui';
import { SectionHeader } from '@/components/common';
import { colors, spacing, typography, radii, shadows } from '@/theme';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores';

type ScreenState = 'loading' | 'error' | 'ready';

interface SettingsItem {
  id: string;
  icon: string;
  label: string;
  route?: string;
}

const ACCOUNT_ITEMS: SettingsItem[] = [
  { id: 'notifications', icon: 'notifications', label: 'Notifications', route: '/profile/notifications' },
  { id: 'privacy', icon: 'security', label: 'Privacy & Security', route: '/profile/privacy' },
  { id: 'subscription', icon: 'star', label: 'Subscription & Billing', route: '/profile/subscription' },
  { id: 'connected', icon: 'email', label: 'Connected Email & Accounts', route: '/profile/connected-accounts' },
];

const DATA_ITEMS: SettingsItem[] = [
  { id: 'data', icon: 'folder', label: 'Data & Evidence Controls' },
  { id: 'help', icon: 'help', label: 'Help & Support' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const logout = useAuthStore((s) => s.logout);
  const [screenState, setScreenState] = useState<ScreenState>('ready');

  const handleSettingsPress = useCallback(
    (item: SettingsItem) => {
      if (item.route) {
        router.push(item.route as never);
      } else {
        Alert.alert(item.label, `${item.label} settings will be available in a future update.`);
      }
    },
    [router],
  );

  const handleSignOut = useCallback(() => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out? You will need to log in again to access your claims.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/');
          },
        },
      ],
    );
  }, [logout, router]);

  const handleRetry = useCallback(() => {
    setScreenState('loading');
    setTimeout(() => setScreenState('ready'), 600);
  }, []);

  if (screenState === 'loading') {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <CardSkeleton style={styles.skeletonCard} />
          <CardSkeleton style={styles.skeletonCard} />
          <CardSkeleton style={styles.skeletonCard} />
        </ScrollView>
      </View>
    );
  }

  if (screenState === 'error') {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <ErrorState
          title="Profile unavailable"
          description="Unable to load your profile. Please try again."
          onRetry={handleRetry}
        />
      </View>
    );
  }

  const isPro = user?.subscriptionTier === 'pro';

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Hero */}
        <View style={styles.profileHero}>
          <View style={styles.avatarContainer}>
            <Avatar
              name={user?.name ?? 'User'}
              uri={user?.avatarUri ?? undefined}
              size="xl"
              showProBadge={isPro}
              accessibilityLabel={`${user?.name ?? 'User'} profile picture`}
            />
          </View>
          <Text style={styles.userName}>{user?.name ?? 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email ?? ''}</Text>
          {isPro && (
            <Badge
              label="Pro Member"
              variant="primary"
              icon="star"
              style={styles.proBadge}
            />
          )}
        </View>

        {/* Account Management */}
        <View style={styles.section}>
          <SectionHeader title="Account Management" />
          <View style={styles.settingsCard}>
            {ACCOUNT_ITEMS.map((item, index) => (
              <Pressable
                key={item.id}
                style={[
                  styles.settingsItem,
                  index < ACCOUNT_ITEMS.length - 1 && styles.settingsItemBorder,
                ]}
                onPress={() => handleSettingsPress(item)}
                accessibilityRole="button"
                accessibilityLabel={item.label}
              >
                <View style={styles.settingsItemIconCircle}>
                  <Icon name={item.icon} size={20} color={colors.primary} />
                </View>
                <Text style={styles.settingsItemLabel}>{item.label}</Text>
                <Icon name="chevron_right" size={20} color={colors.onSurfaceVariant} />
              </Pressable>
            ))}
          </View>
        </View>

        {/* Data & Support */}
        <View style={styles.section}>
          <SectionHeader title="Data & Support" />
          <View style={styles.settingsCard}>
            {DATA_ITEMS.map((item, index) => (
              <Pressable
                key={item.id}
                style={[
                  styles.settingsItem,
                  index < DATA_ITEMS.length - 1 && styles.settingsItemBorder,
                ]}
                onPress={() => handleSettingsPress(item)}
                accessibilityRole="button"
                accessibilityLabel={item.label}
              >
                <View style={styles.settingsItemIconCircle}>
                  <Icon name={item.icon} size={20} color={colors.primary} />
                </View>
                <Text style={styles.settingsItemLabel}>{item.label}</Text>
                <Icon name="chevron_right" size={20} color={colors.onSurfaceVariant} />
              </Pressable>
            ))}
          </View>
        </View>

        {/* Sign Out */}
        <View style={styles.signOutSection}>
          <Pressable
            style={styles.signOutButton}
            onPress={handleSignOut}
            accessibilityRole="button"
            accessibilityLabel="Sign out of your account"
          >
            <Icon name="logout" size={20} color={colors.error} />
            <Text style={styles.signOutText}>Sign Out</Text>
          </Pressable>
        </View>

        {/* Version */}
        <Text style={styles.versionText}>v1.0.0</Text>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing[5],
  },
  profileHero: {
    alignItems: 'center',
    paddingTop: spacing[8],
    paddingBottom: spacing[6],
  },
  avatarContainer: {
    marginBottom: spacing[5],
  },
  userName: {
    ...typography.headlineLg,
    color: colors.onSurface,
    marginBottom: spacing[1],
    textAlign: 'center',
  },
  userEmail: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginBottom: spacing[3],
  },
  proBadge: {
    marginTop: spacing[1],
  },
  section: {
    marginTop: spacing[4],
  },
  settingsCard: {
    marginTop: spacing[2],
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radii.xl,
    paddingVertical: spacing[1],
    overflow: 'hidden',
    ...shadows.ambient,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[5],
  },
  settingsItemBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.surfaceContainerHigh,
  },
  settingsItemIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },
  settingsItemLabel: {
    ...typography.bodyMd,
    color: colors.onSurface,
    flex: 1,
  },
  signOutSection: {
    marginTop: spacing[8],
    alignItems: 'center',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[6],
    backgroundColor: `${colors.error}10`,
    borderRadius: radii.xl,
  },
  signOutText: {
    ...typography.labelLg,
    color: colors.error,
  },
  versionText: {
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: spacing[6],
    opacity: 0.5,
  },
  bottomSpacer: {
    height: spacing[12],
  },
  skeletonCard: {
    marginTop: spacing[4],
  },
});
