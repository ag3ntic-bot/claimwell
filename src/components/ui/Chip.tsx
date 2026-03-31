/**
 * Chip component
 *
 * Status chips with semantic color variants.
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { colors, radii, spacing, typography } from '@/theme';
import { Icon } from './Icon';

export type ChipVariant = 'primary' | 'secondary' | 'tertiary' | 'error';
export type ChipSize = 'sm' | 'md';

export interface ChipProps {
  /** Chip label text */
  label: string;
  /** Color variant. Default 'primary'. */
  variant?: ChipVariant;
  /** Optional leading icon name */
  icon?: string;
  /** Size. Default 'md'. */
  size?: ChipSize;
  /** Optional style overrides */
  style?: StyleProp<ViewStyle>;
  /** Accessibility label */
  accessibilityLabel?: string;
}

const VARIANT_STYLES: Record<ChipVariant, { bg: string; text: string }> = {
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

export const Chip: React.FC<ChipProps> = ({
  label,
  variant = 'primary',
  icon,
  size = 'md',
  style,
  accessibilityLabel,
}) => {
  const { bg, text } = VARIANT_STYLES[variant];
  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: bg,
          paddingVertical: isSmall ? 2 : 6,
          paddingHorizontal: isSmall ? 8 : 12,
        },
        style,
      ]}
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="text"
    >
      {icon ? (
        <Icon
          name={icon}
          size={isSmall ? 14 : 16}
          color={text}
          style={styles.icon}
        />
      ) : null}
      <Text
        style={[
          isSmall ? styles.labelSm : styles.labelMd,
          { color: text },
        ]}
        numberOfLines={1}
      >
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
  },
  icon: {
    marginRight: spacing[1],
  },
  labelSm: {
    ...typography.labelSm,
    fontWeight: '600',
  },
  labelMd: {
    ...typography.labelMd,
    fontWeight: '600',
  },
});
