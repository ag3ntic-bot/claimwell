/**
 * Resolved Claim Success Screen
 *
 * Celebration screen shown after a claim is successfully resolved.
 * Features decorative elements, value summary, stats, timeline,
 * and archive/download actions.
 */

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';

import {
  Badge,
  Button,
  Card,
  Icon,
  ProgressBar,
  CardSkeleton,
  ErrorState,
  EmptyState,
} from '@/components/ui';
import { MetricBlock } from '@/components/common';
import { colors, spacing, typography, radii, shadows } from '@/theme';
import { useClaim } from '@/hooks/queries/useClaim';
import { formatCurrency, formatAbsoluteDate } from '@/utils';

type ScreenState = 'loading' | 'error' | 'ready';

const RESOLUTION_STAGES = ['Initiated', 'Negotiation', 'Resolved'];

export default function ResolvedClaimScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [screenState, setScreenState] = useState<ScreenState>('ready');

  // Pulsing ring animation
  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [pulseAnim]);

  const { data: claim } = useClaim(id);

  if (!claim) return null;

  const resolvedAmount = claim.amountRecovered ?? claim.amountClaimed;

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleArchive = useCallback(() => {
    router.replace('/');
  }, [router]);

  const handleDownloadReport = useCallback(() => {
    // In production, this would trigger a report download
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
          <View style={styles.headerArea}>
            <CardSkeleton />
          </View>
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
          title="Unable to load"
          description="Could not load the resolved claim details. Please try again."
          onRetry={handleRetry}
        />
      </View>
    );
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* Decorative Background Elements */}
      <View style={styles.decorativeBg}>
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button */}
        <Pressable
          onPress={handleBack}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Icon name="arrow_back" size={24} color={colors.onSurface} />
        </Pressable>

        {/* Celebration Header */}
        <View style={styles.celebrationHeader}>
          <View style={styles.iconOuterRing}>
            <Animated.View
              style={[
                styles.iconPulseRing,
                { transform: [{ scale: pulseAnim }] },
              ]}
            />
            <View style={styles.iconInnerCircle}>
              <Icon name="check_circle" size={48} color={colors.primary} />
            </View>
          </View>
          <Text style={styles.celebrationTitle} accessibilityRole="header">
            Claim Resolved{'\n'}Successfully!
          </Text>
          <Text style={styles.celebrationDescription}>
            Congratulations! Your claim against {claim.companyName} has been
            resolved. Here is a summary of the outcome.
          </Text>
        </View>

        {/* Main Grid */}
        <View style={styles.mainGrid}>
          {/* Total Value Secured */}
          <Card
            style={styles.valueCard}
            accessibilityLabel={`Total value secured: ${formatCurrency(resolvedAmount)}`}
          >
            <Text style={styles.valueLabel}>Total Value Secured</Text>
            <Text style={styles.valueAmount}>{formatCurrency(resolvedAmount)}</Text>
            <View style={styles.verifiedRow}>
              <Icon name="verified" size={16} color={colors.primary} />
              <Text style={styles.verifiedText}>
                Full amount recovered
              </Text>
            </View>
          </Card>

          {/* Resolution Details */}
          <Card
            style={styles.detailsCard}
            accessibilityLabel="Resolution details"
          >
            <View style={styles.detailsHeader}>
              <Icon name="description" size={20} color={colors.primary} />
              <Text style={styles.detailsHeaderText}>Resolution Details</Text>
            </View>
            <Text style={styles.detailsTitle}>{claim.title}</Text>
            <View style={styles.detailsRow}>
              <Text style={styles.detailsLabel}>Case ID</Text>
              <Text style={styles.detailsValue}>{claim.caseId}</Text>
            </View>
            <View style={styles.detailsRow}>
              <Text style={styles.detailsLabel}>Company</Text>
              <Text style={styles.detailsValue}>{claim.companyName}</Text>
            </View>
            {claim.resolvedAt && (
              <View style={styles.detailsRow}>
                <Text style={styles.detailsLabel}>Resolved</Text>
                <Text style={styles.detailsValue}>
                  {formatAbsoluteDate(claim.resolvedAt)}
                </Text>
              </View>
            )}
          </Card>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statBlock}>
            <MetricBlock
              icon="schedule"
              label="Speed to Resolution"
              value="18 days"
              variant="tertiary"
            />
          </View>
          <View style={styles.statBlock}>
            <MetricBlock
              icon="email"
              label="Engagement"
              value="3 emails"
              variant="secondary"
            />
          </View>
          <View style={styles.statBlock}>
            <MetricBlock
              icon="warning"
              label="Process"
              value="1 escalation"
              variant="error"
            />
          </View>
        </View>

        {/* Resolution Progress */}
        <Card style={styles.progressCard} accessibilityLabel="Resolution timeline">
          <Text style={styles.progressTitle}>Resolution Timeline</Text>
          <View style={styles.progressBarContainer}>
            <ProgressBar progress={1} variant="primary" height={6} />
          </View>
          <View style={styles.stagesRow}>
            {RESOLUTION_STAGES.map((stage, index) => (
              <View key={stage} style={styles.stageItem}>
                <View
                  style={[
                    styles.stageDot,
                    { backgroundColor: colors.primary },
                  ]}
                />
                <Text style={styles.stageLabel}>{stage}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Button
            variant="primary"
            label="Archive Case"
            icon="folder"
            onPress={handleArchive}
            fullWidth
            accessibilityLabel="Archive this resolved case"
          />
          <Button
            variant="secondary"
            label="Download Report"
            icon="download"
            onPress={handleDownloadReport}
            fullWidth
            accessibilityLabel="Download a report of this case"
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
  decorativeBg: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  decorativeCircle1: {
    position: 'absolute',
    top: -80,
    right: -60,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: colors.primaryContainer,
    opacity: 0.15,
  },
  decorativeCircle2: {
    position: 'absolute',
    top: 100,
    left: -100,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.tertiaryContainer,
    opacity: 0.1,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing[2],
    marginLeft: -spacing[2],
  },
  headerArea: {
    paddingTop: spacing[6],
  },
  celebrationHeader: {
    alignItems: 'center',
    paddingTop: spacing[4],
    paddingBottom: spacing[8],
  },
  iconOuterRing: {
    width: 112,
    height: 112,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[6],
  },
  iconPulseRing: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 56,
    borderWidth: 2,
    borderColor: colors.primary,
    opacity: 0.2,
  },
  iconInnerCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  celebrationTitle: {
    ...typography.displaySm,
    fontWeight: '800',
    color: colors.onSurface,
    textAlign: 'center',
    marginBottom: spacing[3],
  },
  celebrationDescription: {
    ...typography.bodyLg,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 26,
    maxWidth: 340,
  },
  mainGrid: {
    gap: spacing[3],
    marginBottom: spacing[6],
  },
  valueCard: {
    alignItems: 'center',
    paddingVertical: spacing[8],
  },
  valueLabel: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
    marginBottom: spacing[2],
  },
  valueAmount: {
    ...typography.displayLg,
    color: colors.primary,
    marginBottom: spacing[3],
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1.5],
  },
  verifiedText: {
    ...typography.labelMd,
    color: colors.primary,
  },
  detailsCard: {
    backgroundColor: colors.surfaceContainerLow,
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[4],
  },
  detailsHeaderText: {
    ...typography.titleMd,
    color: colors.primary,
  },
  detailsTitle: {
    ...typography.titleLg,
    color: colors.onSurface,
    marginBottom: spacing[4],
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[2],
  },
  detailsLabel: {
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
  },
  detailsValue: {
    ...typography.titleSm,
    color: colors.onSurface,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing[2],
    marginBottom: spacing[6],
  },
  statBlock: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radii.xl,
    padding: spacing[4],
    alignItems: 'center',
    ...shadows.ambient,
  },
  progressCard: {
    marginBottom: spacing[6],
  },
  progressTitle: {
    ...typography.titleMd,
    color: colors.onSurface,
    marginBottom: spacing[4],
  },
  progressBarContainer: {
    marginBottom: spacing[4],
  },
  stagesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stageItem: {
    alignItems: 'center',
    gap: spacing[1.5],
  },
  stageDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  stageLabel: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
  },
  actions: {
    gap: spacing[3],
    marginBottom: spacing[4],
  },
  bottomSpacer: {
    height: spacing[12],
  },
  skeletonCard: {
    marginTop: spacing[4],
  },
});
