/**
 * MetricBlock
 *
 * Single metric display with icon, label, and value.
 * Used in resolved screen stats and other summary views.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Icon } from '@/components/ui';
import { colors, radii, spacing, typography } from '@/theme';

export type MetricVariant = 'primary' | 'tertiary' | 'error' | 'secondary';

export interface MetricBlockProps {
  /** Icon name (Material Symbols) */
  icon: string;
  /** Metric label */
  label: string;
  /** Metric value */
  value: string;
  /** Color variant. Default 'primary'. */
  variant?: MetricVariant;
}

const VARIANT_COLORS: Record<MetricVariant, { icon: string; iconBg: string }> = {
  primary: {
    icon: colors.primary,
    iconBg: `${colors.primaryContainer}66`,
  },
  tertiary: {
    icon: colors.tertiary,
    iconBg: `${colors.tertiaryContainer}66`,
  },
  error: {
    icon: colors.error,
    iconBg: `${colors.errorContainer}66`,
  },
  secondary: {
    icon: colors.onSurfaceVariant,
    iconBg: colors.surfaceContainerHigh,
  },
};

export const MetricBlock: React.FC<MetricBlockProps> = ({
  icon,
  label,
  value,
  variant = 'primary',
}) => {
  const variantColors = VARIANT_COLORS[variant];

  return (
    <View
      style={styles.container}
      accessibilityRole="text"
      accessibilityLabel={`${label}: ${value}`}
    >
      <View style={[styles.iconContainer, { backgroundColor: variantColors.iconBg }]}>
        <Icon name={icon} size={22} color={variantColors.icon} />
      </View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[2],
  },
  label: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    marginBottom: spacing[1],
    textAlign: 'center',
  },
  value: {
    ...typography.titleMd,
    color: colors.onSurface,
    textAlign: 'center',
  },
});
