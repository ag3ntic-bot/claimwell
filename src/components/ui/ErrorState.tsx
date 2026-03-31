/**
 * ErrorState component
 *
 * Error display with icon, title, description, and retry button.
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { colors, spacing, typography } from '@/theme';
import { Icon } from './Icon';
import { Button } from './Button';

export interface ErrorStateProps {
  /** Error title. Default 'Something went wrong'. */
  title?: string;
  /** Error description */
  description?: string;
  /** Retry handler */
  onRetry?: () => void;
  /** Optional style overrides */
  style?: StyleProp<ViewStyle>;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  description = 'An unexpected error occurred. Please try again.',
  onRetry,
  style,
}) => {
  return (
    <View style={[styles.container, style]} accessibilityRole="alert">
      <View style={styles.iconContainer}>
        <Icon
          name="error"
          size={48}
          color={colors.error}
        />
      </View>
      <Text style={styles.title}>{title}</Text>
      {description ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}
      {onRetry ? (
        <View style={styles.actionWrapper}>
          <Button
            variant="secondary"
            label="Try again"
            icon="refresh"
            onPress={onRetry}
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
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.errorContainer,
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
    marginBottom: spacing[4],
  },
  actionWrapper: {
    marginTop: spacing[2],
  },
});
