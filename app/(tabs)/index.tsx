/**
 * Home Dashboard Screen
 *
 * Main landing screen showing welcome hero, stats grid,
 * actions needed, active claims, and strategy insight.
 */

import React, { useState, useCallback } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';

import { GlassHeader, Avatar, Button, Icon, CardSkeleton, ErrorState } from '@/components/ui';
import { ClaimCard, ActionNeededCard } from '@/components/claim';
import { StatsGrid, StrategyInsightCard } from '@/components/dashboard';
import { SectionHeader } from '@/components/common';
import { colors, spacing, typography } from '@/theme';
import { useAuth } from '@/hooks/useAuth';
import { useClaims, useClaimSummary } from '@/hooks/queries/useClaims';
import type { Claim } from '@/types';

export default function HomeScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { data: claims = [], isLoading: claimsLoading, isError: claimsError } = useClaims();
  const { data: claimSummary } = useClaimSummary();

  const [refreshing, setRefreshing] = useState(false);

  const activeClaims = claims.filter(
    (c) => c.status !== 'resolved' && c.status !== 'archived',
  );

  const userName = user?.name ?? 'User';
  const summary = claimSummary ?? { activeClaims: 0, moneyAtStake: 0, totalRecovered: 0 };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['claims'] });
    setRefreshing(false);
  }, [queryClient]);

  const handleClaimPress = useCallback(
    (claim: Claim) => {
      router.push(`/claims/${claim.id}`);
    },
    [router],
  );

  const handleNewClaim = useCallback(() => {
    router.push('/(tabs)/new-claim/' as never);
  }, [router]);

  const handleStrategyPress = useCallback(() => {
    router.push('/strategy');
  }, [router]);

  if (claimsLoading) {
    return (
      <View style={styles.screen}>
        <GlassHeader title="Claimwell" />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.skeletonHero}>
            <CardSkeleton />
          </View>
          <View style={styles.section}>
            <CardSkeleton />
          </View>
          <View style={styles.section}>
            <CardSkeleton />
            <View style={{ height: spacing[3] }} />
            <CardSkeleton />
          </View>
        </ScrollView>
      </View>
    );
  }

  if (claimsError) {
    return (
      <View style={styles.screen}>
        <GlassHeader title="Claimwell" />
        <ErrorState
          title="Unable to load dashboard"
          description="We couldn't fetch your latest claim data. Please check your connection and try again."
          onRetry={handleRefresh}
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <GlassHeader
        title="Claimwell"
        left={
          <Avatar
            name={userName}
            uri={user?.avatarUri ?? undefined}
            size="sm"
            showProBadge={user?.subscriptionTier === 'pro'}
            accessibilityLabel={`${userName} profile`}
          />
        }
        right={
          <Icon
            name="notifications_none"
            size={24}
            color={colors.onSurface}
            accessibilityLabel="Notifications"
          />
        }
      />

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
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroHeading}>
            Welcome back, {userName.split(' ')[0]}
          </Text>
          <Text style={styles.heroDescription}>
            Track your active claims, review AI-powered strategies, and take the
            next step toward resolution.
          </Text>
          <Button
            variant="primary"
            label="Start a New Claim"
            icon="add"
            onPress={handleNewClaim}
            accessibilityLabel="Start a new claim"
            style={styles.heroCta}
          />
        </View>

        {/* Stats Grid */}
        <View style={styles.section}>
          <StatsGrid summary={summary} />
        </View>

        {/* Actions Needed Today */}
        {activeClaims.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title="Actions Needed Today" />
            <View style={styles.actionsContainer}>
              <ActionNeededCard
                title="Review Your Claims"
                description={`You have ${activeClaims.length} active claim${activeClaims.length > 1 ? 's' : ''} that may need attention.`}
                variant="primary"
                onPress={() => handleClaimPress(activeClaims[0])}
              />
            </View>
          </View>
        )}

        {/* Active Claims */}
        <View style={styles.section}>
          <SectionHeader
            title="Active Claims"
            actionLabel="See All"
            onAction={() => router.push('/claims')}
          />
          <View style={styles.claimsList}>
            {activeClaims.length === 0 ? (
              <Text style={styles.emptyText}>No active claims yet. Start a new claim to get going.</Text>
            ) : (
              activeClaims.slice(0, 3).map((claim) => (
                <View key={claim.id} style={styles.claimCardWrapper}>
                  <ClaimCard claim={claim} onPress={handleClaimPress} />
                </View>
              ))
            )}
          </View>
        </View>

        {/* Strategy Insight */}
        {activeClaims.length > 0 && (
          <View style={styles.section}>
            <StrategyInsightCard
              title="AI Strategy Available"
              description="Tap to generate AI-powered strategies for your active claims."
              onPress={handleStrategyPress}
            />
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
  },
  heroSection: {
    paddingTop: spacing[6],
    paddingBottom: spacing[4],
  },
  heroHeading: {
    ...typography.headlineLg,
    color: colors.onSurface,
    marginBottom: spacing[2],
  },
  heroDescription: {
    ...typography.bodyLg,
    color: colors.onSurfaceVariant,
    marginBottom: spacing[5],
  },
  heroCta: {
    alignSelf: 'flex-start',
  },
  section: {
    marginTop: spacing[6],
  },
  actionsContainer: {
    gap: spacing[3],
    marginTop: spacing[2],
  },
  claimsList: {
    gap: spacing[3],
    marginTop: spacing[2],
  },
  claimCardWrapper: {},
  skeletonHero: {
    paddingTop: spacing[6],
  },
  bottomSpacer: {
    height: spacing[12],
  },
  emptyText: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    paddingVertical: spacing[8],
  },
});
