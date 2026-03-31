/**
 * Card component
 *
 * Surface Level 2 container. White background, xl corner radius,
 * ambient shadow, padding 24. No borders.
 */

import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { colors, radii, shadows, spacing } from '@/theme';

export interface CardProps {
  children: React.ReactNode;
  /** Optional style overrides */
  style?: StyleProp<ViewStyle>;
  /** Stronger shadow for elevated cards */
  elevated?: boolean;
  /** Accessibility label */
  accessibilityLabel?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  elevated = false,
  accessibilityLabel,
}) => {
  return (
    <View
      style={[
        styles.container,
        elevated ? shadows.elevated : shadows.ambient,
        style,
      ]}
      testID="card"
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="summary"
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radii.xl,
    padding: spacing[6],
  },
});
