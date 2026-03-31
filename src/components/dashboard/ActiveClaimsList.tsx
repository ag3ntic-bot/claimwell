/**
 * ActiveClaimsList
 *
 * Vertical list of ClaimCards with loading state.
 */

import React from 'react';
import { FlatList, StyleSheet, View, ListRenderItemInfo } from 'react-native';
import { CardSkeleton } from '@/components/ui';
import { spacing } from '@/theme';
import { Claim } from '@/types';
import { ClaimCard } from '@/components/claim';

export interface ActiveClaimsListProps {
  /** List of active claims */
  claims: Claim[];
  /** Handler when a claim card is pressed */
  onClaimPress?: (claim: Claim) => void;
  /** Show loading skeletons */
  isLoading?: boolean;
}

export const ActiveClaimsList: React.FC<ActiveClaimsListProps> = ({
  claims,
  onClaimPress,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <View style={styles.skeletonContainer}>
        {[0, 1, 2].map((i) => (
          <CardSkeleton key={i} style={styles.skeletonItem} />
        ))}
      </View>
    );
  }

  const renderItem = ({ item }: ListRenderItemInfo<Claim>) => (
    <View style={styles.cardWrapper}>
      <ClaimCard claim={item} onPress={onClaimPress} />
    </View>
  );

  return (
    <FlatList
      data={claims}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      scrollEnabled={false}
      accessibilityRole="list"
      accessibilityLabel="Active claims"
    />
  );
};

const styles = StyleSheet.create({
  list: {
    gap: spacing[3],
  },
  cardWrapper: {
    // Individual card spacing handled by gap
  },
  skeletonContainer: {
    gap: spacing[3],
  },
  skeletonItem: {
    // Inherits CardSkeleton styling
  },
});
