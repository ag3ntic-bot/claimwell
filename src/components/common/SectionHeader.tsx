/**
 * SectionHeader
 *
 * Section title with optional action link on the right.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '@/theme';

export interface SectionHeaderProps {
  /** Section title text */
  title: string;
  /** Optional action link label */
  actionLabel?: string;
  /** Action link press handler */
  onAction?: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  actionLabel,
  onAction,
}) => {
  return (
    <View style={styles.container}>
      <Text
        style={styles.title}
        accessibilityRole="header"
      >
        {title}
      </Text>
      {actionLabel && onAction && (
        <Pressable
          onPress={onAction}
          accessibilityRole="link"
          accessibilityLabel={actionLabel}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.actionLabel}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing[2],
  },
  title: {
    ...typography.titleLg,
    color: colors.onSurface,
    marginBottom: spacing[2.5],
  },
  actionLabel: {
    ...typography.labelLg,
    color: colors.primary,
  },
});
