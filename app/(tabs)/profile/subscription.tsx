/**
 * Subscription & Billing Screen
 *
 * Shows current plan, feature list, and billing management.
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

import { Badge, Button, Card, Icon, ErrorState, CardSkeleton } from '@/components/ui';
import { colors, spacing, typography, radii, shadows } from '@/theme';
import { useAuth } from '@/hooks/useAuth';

type ScreenState = 'loading' | 'error' | 'ready';

const PRO_FEATURES = [
  { icon: 'star', label: 'Unlimited AI-powered draft letters' },
  { icon: 'analytics', label: 'Advanced response analysis' },
  { icon: 'insights', label: 'AI strategy recommendations' },
  { icon: 'description', label: 'Full template library access' },
  { icon: 'upload', label: 'Unlimited evidence uploads' },
  { icon: 'email', label: 'Email integration & tracking' },
  { icon: 'trending_up', label: 'Priority escalation support' },
];

export default function SubscriptionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [screenState, setScreenState] = useState<ScreenState>('ready');

  const isPro = user?.subscriptionTier === 'pro';

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleManageSubscription = useCallback(() => {
    Alert.alert(
      'Manage Subscription',
      'You will be redirected to your app store subscription management page.',
    );
  }, []);

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
          title="Subscription data unavailable"
          description="Unable to load your subscription details. Please try again."
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
          <Text style={styles.headerTitle}>Subscription</Text>
          <View style={styles.backButton} />
        </View>

        {/* Current Plan Card */}
        <Card
          style={styles.planCard}
          accessibilityLabel={`Current plan: ${isPro ? 'Pro' : 'Free'}`}
        >
          <View style={styles.planHeader}>
            <View style={styles.planIconCircle}>
              <Icon
                name="star"
                size={28}
                color={isPro ? colors.primary : colors.onSurfaceVariant}
              />
            </View>
            <View style={styles.planInfo}>
              <Text style={styles.planName}>
                {isPro ? 'Claimwell Pro' : 'Claimwell Free'}
              </Text>
              <Badge
                label={isPro ? 'Active' : 'Current Plan'}
                variant={isPro ? 'primary' : 'secondary'}
              />
            </View>
          </View>

          {isPro && (
            <View style={styles.planPricing}>
              <Text style={styles.planPrice}>$9.99</Text>
              <Text style={styles.planPeriod}>/month</Text>
            </View>
          )}

          <Text style={styles.planDescription}>
            {isPro
              ? 'You have full access to all Claimwell features including AI-powered drafts, advanced analysis, and priority support.'
              : 'Upgrade to Pro to unlock AI-powered features, unlimited templates, and priority support.'}
          </Text>
        </Card>

        {/* Features List */}
        <View style={styles.featuresSection}>
          <Text style={styles.featuresTitle}>
            {isPro ? 'Your Pro Features' : 'Pro Features'}
          </Text>
          <View style={styles.featuresList}>
            {PRO_FEATURES.map((feature) => (
              <View key={feature.label} style={styles.featureItem}>
                <View style={styles.featureCheck}>
                  <Icon
                    name={isPro ? 'check' : feature.icon}
                    size={18}
                    color={isPro ? colors.primary : colors.onSurfaceVariant}
                  />
                </View>
                <Text
                  style={[
                    styles.featureLabel,
                    !isPro && styles.featureLabelInactive,
                  ]}
                >
                  {feature.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Billing Info */}
        {isPro && (
          <Card style={styles.billingCard} accessibilityLabel="Billing information">
            <Text style={styles.billingTitle}>Billing Information</Text>
            <View style={styles.billingRow}>
              <Text style={styles.billingLabel}>Next billing date</Text>
              <Text style={styles.billingValue}>Apr 15, 2026</Text>
            </View>
            <View style={styles.billingRow}>
              <Text style={styles.billingLabel}>Payment method</Text>
              <Text style={styles.billingValue}>Apple Pay</Text>
            </View>
          </Card>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            variant={isPro ? 'secondary' : 'primary'}
            label={isPro ? 'Manage Subscription' : 'Upgrade to Pro'}
            icon={isPro ? 'settings' : 'star'}
            onPress={handleManageSubscription}
            fullWidth
            accessibilityLabel={isPro ? 'Manage your subscription' : 'Upgrade to Pro plan'}
          />
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
  planCard: {
    marginBottom: spacing[6],
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  planIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[4],
  },
  planInfo: {
    flex: 1,
    gap: spacing[1.5],
  },
  planName: {
    ...typography.titleLg,
    color: colors.onSurface,
  },
  planPricing: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: spacing[3],
  },
  planPrice: {
    ...typography.displaySm,
    color: colors.primary,
  },
  planPeriod: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginLeft: spacing[1],
  },
  planDescription: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    lineHeight: 22,
  },
  featuresSection: {
    marginBottom: spacing[6],
  },
  featuresTitle: {
    ...typography.titleMd,
    color: colors.onSurface,
    marginBottom: spacing[4],
  },
  featuresList: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radii.xl,
    padding: spacing[4],
    ...shadows.ambient,
    gap: spacing[3],
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureCheck: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },
  featureLabel: {
    ...typography.bodyMd,
    color: colors.onSurface,
    flex: 1,
  },
  featureLabelInactive: {
    color: colors.onSurfaceVariant,
  },
  billingCard: {
    backgroundColor: colors.surfaceContainerLow,
    marginBottom: spacing[6],
  },
  billingTitle: {
    ...typography.titleMd,
    color: colors.onSurface,
    marginBottom: spacing[4],
  },
  billingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing[2],
  },
  billingLabel: {
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
  },
  billingValue: {
    ...typography.titleSm,
    color: colors.onSurface,
  },
  actions: {
    marginBottom: spacing[4],
  },
  bottomSpacer: {
    height: spacing[12],
  },
  skeletonCard: {
    marginTop: spacing[4],
  },
});
