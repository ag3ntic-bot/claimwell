/**
 * TimelineList
 *
 * Vertical list of TimelineItems with loading state.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
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

  return (
    <View style={styles.list} accessibilityRole="list" accessibilityLabel="Claim timeline">
      {events.map((event, index) => (
        <TimelineItem
          key={event.id}
          event={event}
          isFirst={index === 0}
          isLast={index === events.length - 1}
        />
      ))}
    </View>
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
