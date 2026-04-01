/**
 * Privacy & Security Settings Screen
 *
 * Biometric lock toggle, data export, and privacy controls.
 */

import React, { useState, useCallback } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { Button, Icon, Card, ErrorState } from '@/components/ui';
import { colors, spacing, typography, radii, shadows } from '@/theme';
export default function PrivacySettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [biometricLock, setBiometricLock] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleExportData = useCallback(async () => {
    setIsExporting(true);
    // Simulate export
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsExporting(false);
    Alert.alert(
      'Data Export Ready',
      'Your data export has been prepared. You will receive an email with a download link shortly.',
    );
  }, []);

  const handleDeleteAccount = useCallback(() => {
    Alert.alert(
      'Delete Account',
      'This action is irreversible. All your claims, evidence, and account data will be permanently deleted. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Account Scheduled for Deletion', 'Your account will be deleted within 30 days. You can cancel this by logging in again during that period.');
          },
        },
      ],
    );
  }, []);

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
          <Text style={styles.headerTitle}>Privacy & Security</Text>
          <View style={styles.backButton} />
        </View>

        <Text style={styles.description}>
          Manage your security preferences and data privacy settings.
        </Text>

        {/* Security Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Security</Text>

          {/* Biometric Lock */}
          <View style={styles.toggleItem}>
            <View style={styles.toggleItemLeft}>
              <View style={styles.toggleIconCircle}>
                <Icon name="lock" size={20} color={colors.primary} />
              </View>
              <View style={styles.toggleTextContainer}>
                <Text style={styles.toggleLabel}>Biometric Lock</Text>
                <Text style={styles.toggleDescription}>
                  Require Face ID or fingerprint to open the app.
                </Text>
              </View>
            </View>
            <Switch
              value={biometricLock}
              onValueChange={setBiometricLock}
              trackColor={{
                false: colors.surfaceContainerHigh,
                true: colors.primaryContainer,
              }}
              thumbColor={biometricLock ? colors.primary : colors.onSurfaceVariant}
              accessibilityLabel="Toggle biometric lock"
              accessibilityRole="switch"
              accessibilityState={{ checked: biometricLock }}
            />
          </View>

          {/* Analytics */}
          <View style={[styles.toggleItem, styles.toggleItemBorder]}>
            <View style={styles.toggleItemLeft}>
              <View style={styles.toggleIconCircle}>
                <Icon name="analytics" size={20} color={colors.primary} />
              </View>
              <View style={styles.toggleTextContainer}>
                <Text style={styles.toggleLabel}>Usage Analytics</Text>
                <Text style={styles.toggleDescription}>
                  Help us improve Claimwell by sharing anonymized usage data.
                </Text>
              </View>
            </View>
            <Switch
              value={analyticsEnabled}
              onValueChange={setAnalyticsEnabled}
              trackColor={{
                false: colors.surfaceContainerHigh,
                true: colors.primaryContainer,
              }}
              thumbColor={analyticsEnabled ? colors.primary : colors.onSurfaceVariant}
              accessibilityLabel="Toggle usage analytics"
              accessibilityRole="switch"
              accessibilityState={{ checked: analyticsEnabled }}
            />
          </View>
        </View>

        {/* Data Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Your Data</Text>

          {/* Export Data */}
          <View style={styles.dataItem}>
            <View style={styles.dataItemContent}>
              <View style={styles.toggleIconCircle}>
                <Icon name="download" size={20} color={colors.primary} />
              </View>
              <View style={styles.toggleTextContainer}>
                <Text style={styles.toggleLabel}>Export Your Data</Text>
                <Text style={styles.toggleDescription}>
                  Download a copy of all your claims, evidence, and account data.
                </Text>
              </View>
            </View>
            <Button
              variant="secondary"
              label="Export"
              onPress={handleExportData}
              loading={isExporting}
              accessibilityLabel="Export your data"
            />
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.dangerSection}>
          <Text style={styles.dangerTitle}>Danger Zone</Text>
          <Pressable
            style={styles.dangerButton}
            onPress={handleDeleteAccount}
            accessibilityRole="button"
            accessibilityLabel="Delete your account permanently"
          >
            <Icon name="delete" size={20} color={colors.error} />
            <Text style={styles.dangerButtonText}>Delete Account</Text>
          </Pressable>
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
  sectionCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radii.xl,
    padding: spacing[5],
    marginBottom: spacing[4],
    ...shadows.ambient,
  },
  sectionTitle: {
    ...typography.titleMd,
    color: colors.onSurface,
    marginBottom: spacing[4],
  },
  toggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing[3],
  },
  toggleItemBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.surfaceContainerHigh,
    marginTop: spacing[1],
    paddingTop: spacing[4],
  },
  toggleItemLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginRight: spacing[3],
  },
  toggleIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
    marginTop: spacing[0.5],
  },
  toggleTextContainer: {
    flex: 1,
  },
  toggleLabel: {
    ...typography.titleSm,
    color: colors.onSurface,
    marginBottom: spacing[0.5],
  },
  toggleDescription: {
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
    lineHeight: 18,
  },
  dataItem: {
    paddingVertical: spacing[2],
  },
  dataItemContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing[4],
  },
  dangerSection: {
    marginTop: spacing[4],
    alignItems: 'center',
  },
  dangerTitle: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
    marginBottom: spacing[3],
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[6],
    backgroundColor: `${colors.error}10`,
    borderRadius: radii.xl,
  },
  dangerButtonText: {
    ...typography.labelLg,
    color: colors.error,
  },
  bottomSpacer: {
    height: spacing[12],
  },
});
