/**
 * Strategy Hub Screen
 *
 * Overview of all active claims with their strategy summaries,
 * strength percentages, and recommended next actions.
 */

import React, { useState, useCallback } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';

import {
  Card,
  Icon,
  ProgressBar,
  Badge,
  EmptyState,
  ErrorState,
  CardSkeleton,
} from '@/components/ui';
import { colors, spacing, typography, radii } from '@/theme';
import { mockClaims, mockStrategy } from '@/testing/fixtures';
import type { Claim } from '@/types';

type ScreenState = 'loading' | 'error' | 'ready';

export default function StrategyHubScreen() {
  const router = useRouter();
  const [screenState, setScreenState] = useState<ScreenState>('ready');
  const [refreshing, setRefreshing] = useState(false);

  const activeClaims = mockClaims.filter(
    (c) => c.status !== 'resolved' && c.status !== 'archived',
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setRefreshing(false);
  }, []);

  const handleClaimStrategy = useCallback(
    (claim: Claim) => {
      router.push(`/claims/${claim.id}`);
    },
    [router],
  );

  const handleRetry = useCallback(() => {
    setScreenState('loading');
    setTimeout(() => setScreenState('ready'), 600);
  }, []);

  if (screenState === 'loading') {
    return (
      <View style={styles.screen}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerSection}>
            <Text style={styles.heading}>Strategy Hub</Text>
          </View>
          {[0, 1, 2].map((i) => (
            <View key={i} style={styles.skeletonCard}>
              <CardSkeleton />
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  if (screenState === 'error') {
    return (
      <View style={styles.screen}>
        <View style={styles.errorHeaderSection}>
          <Text style={styles.heading}>Strategy Hub</Text>
        </View>
        <ErrorState
          title="Unable to load strategies"
          description="We couldn't load your claim strategies. Please check your connection and try again."
          onRetry={handleRetry}
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Header */}
        <View style={styles.headerSection}>
          <Text style={styles.heading}>Strategy Hub</Text>
          <Text style={styles.description}>
            AI-powered strategies for each of your active claims. Review
            recommended actions, track claim strength, and plan your next steps.
          </Text>
        </View>

        {/* Strategy Cards */}
        {activeClaims.length === 0 ? (
          <EmptyState
            icon="insights"
            title="No active strategies"
            description="Start a claim to get AI-powered strategy recommendations tailored to your situation."
            actionLabel="Start a Claim"
            onAction={() => router.push('/(tabs)/new-claim/' as never)}
          />
        ) : (
          <View style={styles.strategiesList}>
            {activeClaims.map((claim) => {
              const strengthLabel =
                claim.strength >= 75
                  ? 'High'
                  : claim.strength >= 50
                    ? 'Medium'
                    : 'Low';
              const strengthVariant =
                strengthLabel === 'High'
                  ? 'primary'
                  : strengthLabel === 'Medium'
                    ? 'tertiary'
                    : ('error' as const);

              // For the first claim we have real strategy data;
              // for others, derive a plausible recommendation
              const isMainClaim = claim.id === mockStrategy.claimId;
              const recommendedAction = isMainClaim
                ? mockStrategy.recommendedAction
                : claim.status === 'submitted'
                  ? 'Follow up with company support'
                  : claim.status === 'reviewing'
                    ? 'Prepare additional documentation'
                    : 'Send formal written appeal';

              return (
                <Pressable
                  key={claim.id}
                  onPress={() => handleClaimStrategy(claim)}
                  accessibilityRole="button"
                  accessibilityLabel={`Strategy for ${claim.title}. Strength ${claim.strength}%. Recommended: ${recommendedAction}`}
                >
                  <Card style={styles.strategyCard}>
                    {/* Top Row: title + company */}
                    <View style={styles.cardTopRow}>
                      <View style={styles.cardTitleContainer}>
                        <Text style={styles.cardTitle} numberOfLines={1}>
                          {claim.title}
                        </Text>
                        <Text style={styles.cardCompany}>
                          {claim.companyName}
                        </Text>
                      </View>
                      <Icon
                        name="chevron_right"
                        size={20}
                        color={colors.onSurfaceVariant}
                      />
                    </View>

                    {/* Strength */}
                    <View style={styles.strengthRow}>
                      <Text style={styles.strengthLabel}>Claim Strength</Text>
                      <View style={styles.strengthValueRow}>
                        <Text style={styles.strengthValue}>
                          {claim.strength}%
                        </Text>
                        <Badge
                          label={strengthLabel}
                          variant={strengthVariant}
                        />
                      </View>
                    </View>
                    <ProgressBar
                      progress={claim.strength / 100}
                      variant={strengthVariant === 'error' ? 'error' : 'primary'}
                      style={styles.strengthBar}
                    />

                    {/* Recommended Action */}
                    <View style={styles.actionRow}>
                      <View style={styles.actionIconContainer}>
                        <Icon
                          name="star"
                          size={16}
                          color={colors.tertiary}
                        />
                      </View>
                      <View style={styles.actionTextContainer}>
                        <Text style={styles.actionLabel}>Next Action</Text>
                        <Text style={styles.actionValue} numberOfLines={2}>
                          {recommendedAction}
                        </Text>
                      </View>
                    </View>

                    {/* Days left badge (if applicable) */}
                    {isMainClaim && mockStrategy.daysLeftToAppeal != null && (
                      <Badge
                        label={`${mockStrategy.daysLeftToAppeal} days left to appeal`}
                        variant="tertiary"
                        icon="schedule"
                        style={styles.deadlineBadge}
                      />
                    )}
                  </Card>
                </Pressable>
              );
            })}
          </View>
        )}

        {/* Bottom padding */}
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
    paddingTop: spacing[16],
  },
  headerSection: {
    paddingTop: spacing[6],
    paddingBottom: spacing[2],
  },
  errorHeaderSection: {
    paddingTop: spacing[20],
    paddingHorizontal: spacing[5],
  },
  heading: {
    ...typography.headlineLg,
    color: colors.onSurface,
    marginBottom: spacing[2],
  },
  description: {
    ...typography.bodyLg,
    color: colors.onSurfaceVariant,
    lineHeight: 26,
  },
  strategiesList: {
    gap: spacing[4],
    marginTop: spacing[6],
  },
  strategyCard: {
    padding: spacing[5],
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing[4],
  },
  cardTitleContainer: {
    flex: 1,
    marginRight: spacing[3],
  },
  cardTitle: {
    ...typography.titleMd,
    color: colors.onSurface,
    marginBottom: spacing[0.5],
  },
  cardCompany: {
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
  },
  strengthRow: {
    marginBottom: spacing[2],
  },
  strengthLabel: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    marginBottom: spacing[1],
  },
  strengthValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  strengthValue: {
    ...typography.headlineSm,
    color: colors.onSurface,
  },
  strengthBar: {
    marginBottom: spacing[4],
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radii.md,
    padding: spacing[3],
    marginBottom: spacing[3],
  },
  actionIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${colors.tertiaryContainer}66`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },
  actionTextContainer: {
    flex: 1,
  },
  actionLabel: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    marginBottom: spacing[0.5],
  },
  actionValue: {
    ...typography.bodyMd,
    color: colors.onSurface,
  },
  deadlineBadge: {
    marginTop: spacing[1],
  },
  skeletonCard: {
    marginBottom: spacing[4],
    marginTop: spacing[4],
  },
  bottomSpacer: {
    height: spacing[12],
  },
});
