/**
 * Connected Accounts Screen
 *
 * List of connected email accounts with the ability
 * to add new accounts or disconnect existing ones.
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

import { Badge, Button, Card, Icon, EmptyState, ErrorState, CardSkeleton } from '@/components/ui';
import { colors, spacing, typography, radii, shadows } from '@/theme';
import { mockUser } from '@/testing/fixtures';

type ScreenState = 'loading' | 'error' | 'ready';

interface ConnectedAccount {
  id: string;
  email: string;
  provider: string;
  providerIcon: string;
  connected: boolean;
  isPrimary: boolean;
}

const INITIAL_ACCOUNTS: ConnectedAccount[] = [
  {
    id: 'acc_01',
    email: mockUser.email,
    provider: 'Google',
    providerIcon: 'email',
    connected: true,
    isPrimary: true,
  },
];

export default function ConnectedAccountsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [screenState, setScreenState] = useState<ScreenState>('ready');
  const [accounts, setAccounts] = useState<ConnectedAccount[]>(INITIAL_ACCOUNTS);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleAddAccount = useCallback(() => {
    Alert.alert(
      'Add Account',
      'Choose an email provider to connect.',
      [
        {
          text: 'Google',
          onPress: () => {
            const newAccount: ConnectedAccount = {
              id: `acc_${Date.now()}`,
              email: 'personal@gmail.com',
              provider: 'Google',
              providerIcon: 'email',
              connected: true,
              isPrimary: false,
            };
            setAccounts((prev) => [...prev, newAccount]);
          },
        },
        {
          text: 'Outlook',
          onPress: () => {
            const newAccount: ConnectedAccount = {
              id: `acc_${Date.now()}`,
              email: 'user@outlook.com',
              provider: 'Outlook',
              providerIcon: 'email',
              connected: true,
              isPrimary: false,
            };
            setAccounts((prev) => [...prev, newAccount]);
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ],
    );
  }, []);

  const handleDisconnect = useCallback((accountId: string) => {
    const account = accounts.find((a) => a.id === accountId);
    if (!account) return;

    if (account.isPrimary) {
      Alert.alert(
        'Cannot Disconnect',
        'This is your primary account and cannot be disconnected.',
      );
      return;
    }

    Alert.alert(
      'Disconnect Account',
      `Are you sure you want to disconnect ${account.email}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: () => {
            setAccounts((prev) => prev.filter((a) => a.id !== accountId));
          },
        },
      ],
    );
  }, [accounts]);

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
        </ScrollView>
      </View>
    );
  }

  if (screenState === 'error') {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <ErrorState
          title="Accounts unavailable"
          description="Unable to load your connected accounts. Please try again."
          onRetry={handleRetry}
        />
      </View>
    );
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={handleBack}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Icon name="arrow_back" size={24} color={colors.onSurface} />
          </Pressable>
          <Text style={styles.headerTitle}>Connected Accounts</Text>
          <View style={styles.backButton} />
        </View>

        <Text style={styles.description}>
          Connect your email accounts to automatically import claim-related
          correspondence and track communications.
        </Text>

        {/* Accounts List */}
        {accounts.length === 0 ? (
          <EmptyState
            icon="email"
            title="No accounts connected"
            description="Connect an email account to start automatically tracking your claim communications."
            actionLabel="Add Account"
            onAction={handleAddAccount}
          />
        ) : (
          <View style={styles.accountsList}>
            {accounts.map((account) => (
              <Card
                key={account.id}
                style={styles.accountCard}
                accessibilityLabel={`${account.email} via ${account.provider}${account.isPrimary ? ', primary account' : ''}`}
              >
                <View style={styles.accountContent}>
                  <View style={styles.accountIconCircle}>
                    <Icon name={account.providerIcon} size={22} color={colors.primary} />
                  </View>
                  <View style={styles.accountInfo}>
                    <View style={styles.accountNameRow}>
                      <Text style={styles.accountEmail} numberOfLines={1}>
                        {account.email}
                      </Text>
                      {account.isPrimary && (
                        <Badge label="Primary" variant="primary" />
                      )}
                    </View>
                    <Text style={styles.accountProvider}>
                      {account.provider}
                    </Text>
                  </View>
                </View>
                {!account.isPrimary && (
                  <Pressable
                    onPress={() => handleDisconnect(account.id)}
                    style={styles.disconnectButton}
                    accessibilityRole="button"
                    accessibilityLabel={`Disconnect ${account.email}`}
                  >
                    <Text style={styles.disconnectText}>Disconnect</Text>
                  </Pressable>
                )}
              </Card>
            ))}
          </View>
        )}

        {/* Add Account Button */}
        <View style={styles.addSection}>
          <Button
            variant="secondary"
            label="Add Email Account"
            icon="add"
            onPress={handleAddAccount}
            fullWidth
            accessibilityLabel="Connect another email account"
          />
        </View>

        {/* Info */}
        <View style={styles.infoCard}>
          <Icon name="info" size={18} color={colors.onSurfaceVariant} />
          <Text style={styles.infoText}>
            Claimwell only reads emails related to your active claims. We never
            access personal or unrelated messages.
          </Text>
        </View>

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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing[2],
    paddingBottom: spacing[4],
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.titleLg,
    color: colors.onSurface,
  },
  description: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginBottom: spacing[6],
    lineHeight: 22,
  },
  accountsList: {
    gap: spacing[3],
    marginBottom: spacing[4],
  },
  accountCard: {},
  accountContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },
  accountInfo: {
    flex: 1,
  },
  accountNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[0.5],
  },
  accountEmail: {
    ...typography.titleSm,
    color: colors.onSurface,
    flexShrink: 1,
  },
  accountProvider: {
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
  },
  disconnectButton: {
    alignSelf: 'flex-start',
    marginTop: spacing[3],
    paddingVertical: spacing[1.5],
    paddingHorizontal: spacing[3],
    backgroundColor: `${colors.error}10`,
    borderRadius: radii.full,
  },
  disconnectText: {
    ...typography.labelSm,
    color: colors.error,
  },
  addSection: {
    marginBottom: spacing[6],
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[2],
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radii.xl,
    padding: spacing[4],
  },
  infoText: {
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
    flex: 1,
    lineHeight: 18,
  },
  bottomSpacer: {
    height: spacing[12],
  },
  skeletonCard: {
    marginTop: spacing[4],
  },
});
