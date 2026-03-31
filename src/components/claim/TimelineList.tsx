/**
 * TimelineList
 *
 * Vertical list of TimelineItems with loading state.
 */

import React from 'react';
import { FlatList, StyleSheet, View, ListRenderItemInfo } from 'react-native';
import { ListItemSkeleton } from '@/components/ui';
import { spacing } from '@/theme';
import { TimelineEvent } from '@/types';
import { TimelineItem } from './TimelineItem';

export interface TimelineListProps {
  /** List of timeline events, ordered chronologically */
  events: TimelineEvent[];
  /** Show loading skeletons */
  isLoading?: boolean;
}

export const TimelineList: React.FC<TimelineListProps> = ({
  events,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <View style={styles.skeletonContainer}>
        {[0, 1, 2, 3].map((i) => (
          <ListItemSkeleton key={i} style={styles.skeletonItem} />
        ))}
      </View>
    );
  }

  const renderItem = ({ item, index }: ListRenderItemInfo<TimelineEvent>) => (
    <TimelineItem
      event={item}
      isFirst={index === 0}
      isLast={index === events.length - 1}
    />
  );

  return (
    <FlatList
      data={events}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      accessibilityRole="list"
      accessibilityLabel="Claim timeline"
    />
  );
};

const styles = StyleSheet.create({
  list: {
    paddingVertical: spacing[2],
  },
  skeletonContainer: {
    paddingVertical: spacing[2],
  },
  skeletonItem: {
    marginBottom: spacing[2],
  },
});
