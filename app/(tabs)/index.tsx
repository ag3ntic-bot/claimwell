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

import { GlassHeader, Avatar, Button, Icon, CardSkeleton, ErrorState } from '@/components/ui';
import { ClaimCard, ActionNeededCard } from '@/components/claim';
import { StatsGrid, StrategyInsightCard } from '@/components/dashboard';
import { SectionHeader } from '@/components/common';
import { colors, spacing, typography } from '@/theme';
import { mockClaimSummary, mockClaims, mockUser } from '@/testing/fixtures';
import type { Claim } from '@/types';

type ScreenState = 'loading' | 'error' | 'ready';

export default function HomeScreen() {
  const router = useRouter();
  const [screenState, setScreenState] = useState<ScreenState>('ready');
  const [refreshing, setRefreshing] = useState(false);

  const activeClaims = mockClaims.filter(
    (c) => c.status !== 'resolved' && c.status !== 'archived',
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate refresh
    await new Promise((resolve) => setTimeout(resolve, 800));
    setRefreshing(false);
  }, []);

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

  const handleRetry = useCallback(() => {
    setScreenState('loading');
    setTimeout(() => setScreenState('ready'), 600);
  }, []);

  if (screenState === 'loading') {
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

  if (screenState === 'error') {
    return (
      <View style={styles.screen}>
        <GlassHeader title="Claimwell" />
        <ErrorState
          title="Unable to load dashboard"
          description="We couldn't fetch your latest claim data. Please check your connection and try again."
          onRetry={handleRetry}
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
            name={mockUser.name}
            uri={mockUser.avatarUri ?? undefined}
            size="sm"
            showProBadge={mockUser.subscriptionTier === 'pro'}
            accessibilityLabel={`${mockUser.name} profile`}
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
            Welcome back, {mockUser.name.split(' ')[0]}
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
          <StatsGrid summary={mockClaimSummary} />
        </View>

        {/* Actions Needed Today */}
        <View style={styles.section}>
          <SectionHeader title="Actions Needed Today" />
          <View style={styles.actionsContainer}>
            <ActionNeededCard
              title="Appeal Deadline Approaching"
              description="iPhone 15 Pro Max claim -- 12 days left to submit your formal appeal."
              variant="error"
              onPress={() => handleClaimPress(mockClaims[0])}
            />
            <ActionNeededCard
              title="Review AI Draft"
              description="Your appeal letter for case #APL-99283 is ready for review and sending."
              variant="primary"
              onPress={() => handleClaimPress(mockClaims[0])}
            />
          </View>
        </View>

        {/* Active Claims */}
        <View style={styles.section}>
          <SectionHeader
            title="Active Claims"
            actionLabel="See All"
            onAction={() => router.push('/claims')}
          />
          <View style={styles.claimsList}>
            {activeClaims.slice(0, 3).map((claim) => (
              <View key={claim.id} style={styles.claimCardWrapper}>
                <ClaimCard claim={claim} onPress={handleClaimPress} />
              </View>
            ))}
          </View>
        </View>

        {/* Strategy Insight */}
        <View style={styles.section}>
          <StrategyInsightCard
            title="AI Strategy Available"
            description="Your iPhone warranty claim has a 76% win probability. A formal appeal letter has been drafted and is ready for review."
            onPress={handleStrategyPress}
          />
        </View>

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
});
