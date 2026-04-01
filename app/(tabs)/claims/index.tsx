/**
 * Claims List Screen
 *
 * Filterable, searchable list of all user claims.
 * Filter chips for status categories. FAB to create new claim.
 */

import React, { useState, useCallback, useMemo } from 'react';
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
  Chip,
  Input,
  Icon,
  EmptyState,
  ErrorState,
  CardSkeleton,
} from '@/components/ui';
import { ClaimCard } from '@/components/claim';
import { colors, spacing, typography, shadows } from '@/theme';
import { useClaims } from '@/hooks/queries/useClaims';
import type { Claim, ClaimStatus } from '@/types';

type FilterKey = 'all' | 'active' | 'reviewing' | 'resolved';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'reviewing', label: 'Reviewing' },
  { key: 'resolved', label: 'Resolved' },
];

const STATUS_GROUPS: Record<FilterKey, ClaimStatus[] | null> = {
  all: null,
  active: ['submitted', 'in_progress', 'appealing'],
  reviewing: ['reviewing'],
  resolved: ['resolved', 'archived'],
};

export default function ClaimsListScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const { data: allClaims = [], isLoading, isError, refetch } = useClaims();

  const filteredClaims = useMemo(() => {
    let claims = allClaims;

    const allowedStatuses = STATUS_GROUPS[activeFilter];
    if (allowedStatuses) {
      claims = claims.filter((c) => allowedStatuses.includes(c.status));
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      claims = claims.filter(
        (c) =>
          c.title.toLowerCase().includes(query) ||
          c.companyName.toLowerCase().includes(query) ||
          c.caseId.toLowerCase().includes(query),
      );
    }

    return claims;
  }, [allClaims, activeFilter, searchQuery]);

  const handleClaimPress = useCallback(
    (claim: Claim) => {
      router.push(`/claims/${claim.id}`);
    },
    [router],
  );

  const handleNewClaim = useCallback(() => {
    router.push('/(tabs)/new-claim/' as never);
  }, [router]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  if (isLoading) {
    return (
      <View style={styles.screen}>
        <View style={styles.headerContainer}>
          <Text style={styles.heading}>Your Claims</Text>
        </View>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {[0, 1, 2].map((i) => (
            <View key={i} style={styles.skeletonCard}>
              <CardSkeleton />
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.screen}>
        <View style={styles.headerContainer}>
          <Text style={styles.heading}>Your Claims</Text>
        </View>
        <ErrorState
          title="Unable to load claims"
          description="We couldn't retrieve your claims. Please check your connection and try again."
          onRetry={handleRefresh}
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
        <View style={styles.headerContainer}>
          <Text style={styles.heading}>Your Claims</Text>
        </View>

        {/* Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterRow}
          contentContainerStyle={styles.filterRowContent}
        >
          {FILTERS.map((filter) => (
            <Pressable
              key={filter.key}
              onPress={() => setActiveFilter(filter.key)}
              accessibilityRole="button"
              accessibilityLabel={`Filter by ${filter.label}${activeFilter === filter.key ? ', selected' : ''}`}
            >
              <Chip
                label={filter.label}
                variant={activeFilter === filter.key ? 'primary' : 'secondary'}
                size="md"
              />
            </Pressable>
          ))}
        </ScrollView>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <Input
            placeholder="Search claims..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            leftIcon="search"
            accessibilityLabel="Search claims"
          />
        </View>

        {/* Claims List */}
        {filteredClaims.length === 0 ? (
          <EmptyState
            icon="description"
            title="No claims found"
            description={
              searchQuery
                ? 'No claims match your search. Try adjusting your query or filters.'
                : 'You haven\'t started any claims yet. Tap below to get started.'
            }
            actionLabel={searchQuery ? undefined : 'Start a Claim'}
            onAction={searchQuery ? undefined : handleNewClaim}
          />
        ) : (
          <View style={styles.claimsList}>
            {filteredClaims.map((claim) => (
              <View key={claim.id} style={styles.claimCardWrapper}>
                <ClaimCard claim={claim} onPress={handleClaimPress} />
              </View>
            ))}
          </View>
        )}

        {/* Bottom padding for FAB clearance */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Floating Action Button */}
      <Pressable
        style={[styles.fab, shadows.elevated]}
        onPress={handleNewClaim}
        accessibilityRole="button"
        accessibilityLabel="Create a new claim"
      >
        <Icon name="add" size={28} color={colors.onPrimary} />
      </Pressable>
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
  headerContainer: {
    paddingTop: spacing[6],
    paddingBottom: spacing[2],
  },
  heading: {
    ...typography.headlineLg,
    color: colors.onSurface,
  },
  filterRow: {
    marginTop: spacing[4],
    marginBottom: spacing[1],
  },
  filterRowContent: {
    gap: spacing[2],
  },
  searchContainer: {
    marginTop: spacing[4],
    marginBottom: spacing[4],
  },
  claimsList: {
    gap: spacing[3],
  },
  claimCardWrapper: {},
  skeletonCard: {
    marginBottom: spacing[3],
  },
  bottomSpacer: {
    height: spacing[24],
  },
  fab: {
    position: 'absolute',
    bottom: spacing[8],
    right: spacing[5],
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
