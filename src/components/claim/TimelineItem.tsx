/**
 * TimelineItem
 *
 * Single timeline event with colored dot, connecting line,
 * title, date, description, and optional attachment.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Icon } from '@/components/ui';
import { colors, radii, spacing, typography } from '@/theme';
import { TimelineEvent, TIMELINE_EVENT_META } from '@/types';

export interface TimelineItemProps {
  /** The timeline event data */
  event: TimelineEvent;
  /** Whether this is the first item (no top line) */
  isFirst?: boolean;
  /** Whether this is the last item (no bottom line) */
  isLast?: boolean;
}

const DOT_COLORS: Record<string, string> = {
  primary: colors.primary,
  error: colors.error,
  tertiary: colors.tertiary,
  surface: colors.onSurfaceVariant,
};

export const TimelineItem: React.FC<TimelineItemProps> = ({
  event,
  isFirst = false,
  isLast = false,
}) => {
  const meta = TIMELINE_EVENT_META[event.type];
  const dotColor = DOT_COLORS[meta.color] ?? colors.primary;

  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <View
      style={styles.container}
      testID="timeline-item"
      accessibilityRole="text"
      accessibilityLabel={`${event.title}, ${formattedDate}. ${event.description}`}
    >
      {/* Left: dot + connecting line */}
      <View style={styles.leftColumn}>
        {!isFirst && <View style={styles.lineTop} />}
        <View style={[styles.dot, { backgroundColor: dotColor }]}>
          <Icon name={meta.icon} size={12} color={colors.onPrimary} />
        </View>
        {!isLast && <View style={styles.lineBottom} />}
      </View>

      {/* Right: content */}
      <View style={styles.content}>
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.date}>{formattedDate}</Text>
        {event.description ? (
          <Text style={styles.description}>{event.description}</Text>
        ) : null}

        {/* Optional attachment */}
        {event.attachmentFileName && (
          <View style={styles.attachment}>
            <Icon
              name={event.attachmentIcon ?? 'attachment'}
              size={16}
              color={colors.primary}
              style={styles.attachmentIcon}
            />
            <Text style={styles.attachmentText} numberOfLines={1}>
              {event.attachmentFileName}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const DOT_SIZE = 28;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    minHeight: 72,
  },
  leftColumn: {
    width: DOT_SIZE,
    alignItems: 'center',
    marginRight: spacing[4],
  },
  lineTop: {
    width: 2,
    flex: 1,
    backgroundColor: colors.surfaceContainerHigh,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lineBottom: {
    width: 2,
    flex: 1,
    backgroundColor: colors.surfaceContainerHigh,
  },
  content: {
    flex: 1,
    paddingBottom: spacing[5],
    paddingTop: spacing[1],
  },
  title: {
    ...typography.titleSm,
    color: colors.onSurface,
    marginBottom: spacing[0.5],
  },
  date: {
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
    marginBottom: spacing[1.5],
  },
  description: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },
  attachment: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing[2],
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radii.md,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    alignSelf: 'flex-start',
  },
  attachmentIcon: {
    marginRight: spacing[2],
  },
  attachmentText: {
    ...typography.bodySm,
    color: colors.primary,
    fontWeight: '500',
  },
});
