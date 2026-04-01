/**
 * Notification Settings Screen
 *
 * Toggle list for notification preferences including
 * push notifications, email notifications, and claim updates.
 */

import React, { useState, useCallback } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { Icon, Card, ErrorState } from '@/components/ui';
import { colors, spacing, typography, radii, shadows } from '@/theme';
import { fetchSettings } from '@/services/api/user';

interface ToggleItem {
  id: string;
  icon: string;
  label: string;
  description: string;
}

const NOTIFICATION_ITEMS: ToggleItem[] = [
  {
    id: 'push',
    icon: 'notifications',
    label: 'Push Notifications',
    description: 'Receive push notifications for claim updates, deadlines, and AI insights.',
  },
  {
    id: 'email',
    icon: 'email',
    label: 'Email Notifications',
    description: 'Get email summaries and important claim alerts in your inbox.',
  },
  {
    id: 'deadlines',
    icon: 'schedule',
    label: 'Deadline Reminders',
    description: 'Be reminded of upcoming appeal deadlines and response windows.',
  },
  {
    id: 'ai_insights',
    icon: 'insights',
    label: 'AI Strategy Alerts',
    description: 'Get notified when AI generates new strategies or draft updates.',
  },
  {
    id: 'resolved',
    icon: 'check_circle',
    label: 'Resolution Updates',
    description: 'Be notified immediately when a claim is resolved.',
  },
];

export default function NotificationsSettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [toggles, setToggles] = useState<Record<string, boolean>>({
    push: true,
    email: true,
    deadlines: true,
    ai_insights: true,
    resolved: true,
  });

  const handleToggle = useCallback((id: string) => {
    setToggles((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

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
          <Text style={styles.headerTitle}>Notifications</Text>
          <View style={styles.backButton} />
        </View>

        <Text style={styles.description}>
          Control how and when Claimwell notifies you about your claims.
        </Text>

        {/* Toggle List */}
        <View style={styles.toggleList}>
          {NOTIFICATION_ITEMS.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.toggleItem,
                index < NOTIFICATION_ITEMS.length - 1 && styles.toggleItemBorder,
              ]}
            >
              <View style={styles.toggleItemLeft}>
                <View style={styles.toggleIconCircle}>
                  <Icon name={item.icon} size={20} color={colors.primary} />
                </View>
                <View style={styles.toggleTextContainer}>
                  <Text style={styles.toggleLabel}>{item.label}</Text>
                  <Text style={styles.toggleDescription}>{item.description}</Text>
                </View>
              </View>
              <Switch
                value={toggles[item.id] ?? false}
                onValueChange={() => handleToggle(item.id)}
                trackColor={{
                  false: colors.surfaceContainerHigh,
                  true: colors.primaryContainer,
                }}
                thumbColor={toggles[item.id] ? colors.primary : colors.onSurfaceVariant}
                accessibilityLabel={`Toggle ${item.label}`}
                accessibilityRole="switch"
                accessibilityState={{ checked: toggles[item.id] }}
              />
            </View>
          ))}
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
  toggleList: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radii.xl,
    overflow: 'hidden',
    ...shadows.ambient,
  },
  toggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[5],
  },
  toggleItemBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.surfaceContainerHigh,
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
  bottomSpacer: {
    height: spacing[12],
  },
});
