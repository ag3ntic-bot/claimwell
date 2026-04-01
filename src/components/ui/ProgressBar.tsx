/**
 * ProgressBar component
 *
 * 4px thick line, primary fill, surface_variant bg. Rounded ends.
 */

import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  View,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { colors } from '@/theme';

export type ProgressBarVariant = 'primary' | 'error' | 'tertiary';

export interface ProgressBarProps {
  /** Progress from 0 to 1 */
  progress: number;
  /** Color variant. Default 'primary'. */
  variant?: ProgressBarVariant;
  /** Bar height in dp. Default 4. */
  height?: number;
  /** Optional style overrides */
  style?: StyleProp<ViewStyle>;
  /** Accessibility label */
  accessibilityLabel?: string;
}

const VARIANT_COLORS: Record<ProgressBarVariant, string> = {
  primary: colors.primary,
  error: colors.error,
  tertiary: colors.tertiary,
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  variant = 'primary',
  height = 4,
  style,
  accessibilityLabel,
}) => {
  const clampedProgress = Math.min(1, Math.max(0, progress));
  const widthAnim = useRef(new Animated.Value(clampedProgress)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: clampedProgress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [clampedProgress, widthAnim]);

  const fillColor = VARIANT_COLORS[variant];

  return (
    <View
      style={[
        styles.track,
        { height, borderRadius: height / 2 },
        style,
      ]}
      testID="progressbar"
      accessibilityLabel={accessibilityLabel ?? `Progress ${Math.round(clampedProgress * 100)}%`}
      accessibilityRole="progressbar"
      accessibilityValue={{
        min: 0,
        max: 100,
        now: Math.round(clampedProgress * 100),
      }}
    >
      <Animated.View
        style={[
          styles.fill,
          {
            height,
            borderRadius: height / 2,
            backgroundColor: fillColor,
            width: widthAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    width: '100%',
    backgroundColor: colors.surfaceVariant,
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
});
