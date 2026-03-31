/**
 * Surface component
 *
 * Configurable surface levels following The Serene Advocate palette.
 * Level 0 = surface (#F9F9F9)
 * Level 1 = surfaceContainerLow (#F2F4F4)
 * Level 2 = surfaceContainerLowest (#FFFFFF)
 */

import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { colors, radii } from '@/theme';

export type SurfaceLevel = 0 | 1 | 2;

export interface SurfaceProps {
  /** Surface level: 0 (base), 1 (low), 2 (white). Default 0. */
  level?: SurfaceLevel;
  children: React.ReactNode;
  /** Optional style overrides */
  style?: StyleProp<ViewStyle>;
  /** Apply xl border radius. Default true. */
  rounded?: boolean;
  /** Accessibility label */
  accessibilityLabel?: string;
}

const LEVEL_COLORS: Record<SurfaceLevel, string> = {
  0: colors.surface,
  1: colors.surfaceContainerLow,
  2: colors.surfaceContainerLowest,
};

export const Surface: React.FC<SurfaceProps> = ({
  level = 0,
  children,
  style,
  rounded = true,
  accessibilityLabel,
}) => {
  return (
    <View
      style={[
        { backgroundColor: LEVEL_COLORS[level] },
        rounded && styles.rounded,
        style,
      ]}
      accessibilityLabel={accessibilityLabel}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  rounded: {
    borderRadius: radii.xl,
  },
});
