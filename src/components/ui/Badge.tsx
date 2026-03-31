/**
 * Badge component
 *
 * Small badge/tag. Similar to Chip but smaller, rounded-full.
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { colors, radii, spacing, typography } from '@/theme';
import { Icon } from './Icon';

export type BadgeVariant = 'primary' | 'secondary' | 'tertiary' | 'error';

export interface BadgeProps {
  /** Badge label text */
  label: string;
  /** Color variant. Default 'primary'. */
  variant?: BadgeVariant;
  /** Optional leading icon name */
  icon?: string;
  /** Optional style overrides */
  style?: StyleProp<ViewStyle>;
  /** Accessibility label */
  accessibilityLabel?: string;
}

const VARIANT_STYLES: Record<BadgeVariant, { bg: string; text: string }> = {
  primary: {
    bg: colors.primaryContainer,
    text: colors.onPrimaryContainer,
  },
  tertiary: {
    bg: colors.tertiaryContainer,
    text: colors.onTertiaryContainer,
  },
  error: {
    bg: colors.errorContainer,
    text: colors.onErrorContainer,
  },
  secondary: {
    bg: colors.surfaceContainerHigh,
    text: colors.onSurface,
  },
};

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'primary',
  icon,
  style,
  accessibilityLabel,
}) => {
  const { bg, text } = VARIANT_STYLES[variant];

  return (
    <View
      style={[styles.base, { backgroundColor: bg }, style]}
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="text"
    >
      {icon ? (
        <Icon
          name={icon}
          size={12}
          color={text}
          style={styles.icon}
        />
      ) : null}
      <Text style={[styles.label, { color: text }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: radii.full,
    paddingVertical: 2,
    paddingHorizontal: 8,
    minHeight: 20,
  },
  icon: {
    marginRight: spacing[0.5],
  },
  label: {
    ...typography.labelSm,
    fontWeight: '600',
    lineHeight: 16,
  },
});
