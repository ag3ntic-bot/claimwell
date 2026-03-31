/**
 * EmptyState component
 *
 * Empty state for lists with large icon, title, description, and optional action.
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { colors, spacing, typography } from '@/theme';
import { Icon } from './Icon';
import { Button } from './Button';

export interface EmptyStateProps {
  /** Large icon name */
  icon: string;
  /** Title text */
  title: string;
  /** Description text */
  description: string;
  /** Optional action button label */
  actionLabel?: string;
  /** Action button handler */
  onAction?: () => void;
  /** Optional style overrides */
  style?: StyleProp<ViewStyle>;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  style,
}) => {
  return (
    <View style={[styles.container, style]} accessibilityRole="summary">
      <View style={styles.iconContainer}>
        <Icon
          name={icon}
          size={56}
          color={colors.onSurfaceVariant}
        />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {actionLabel && onAction ? (
        <View style={styles.actionWrapper}>
          <Button
            variant="primary"
            label={actionLabel}
            onPress={onAction}
          />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[12],
    paddingHorizontal: spacing[8],
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[5],
  },
  title: {
    ...typography.titleLg,
    color: colors.onSurface,
    textAlign: 'center',
    marginBottom: spacing[2],
  },
  description: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    maxWidth: 280,
    marginBottom: spacing[6],
  },
  actionWrapper: {
    marginTop: spacing[2],
  },
});
