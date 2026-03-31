/**
 * Button component
 *
 * Three variants following The Serene Advocate design:
 * - primary: gradient bg (primary -> primaryDim), white text
 * - secondary: surfaceContainerHigh bg, onSurface text
 * - tertiary: text-only, primary color, fontWeight 600
 */

import React, { useCallback, useRef } from 'react';
import {
  Animated,
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { colors, radii, typography } from '@/theme';
import { Icon } from './Icon';

interface LinearGradientProps {
  colors: string[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

let LinearGradient: React.ComponentType<LinearGradientProps> | null = null;
try {
  // expo-linear-gradient is optional
  LinearGradient = require('expo-linear-gradient').LinearGradient;
} catch {
  LinearGradient = null;
}

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary';

export interface ButtonProps {
  /** Visual variant. Default 'primary'. */
  variant?: ButtonVariant;
  /** Button label text */
  label: string;
  /** Press handler */
  onPress?: () => void;
  /** Optional leading icon name (Material Symbols) */
  icon?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Loading state - shows spinner and disables */
  loading?: boolean;
  /** Full width button */
  fullWidth?: boolean;
  /** Accessibility label override */
  accessibilityLabel?: string;
  /** Optional style overrides for the outer wrapper */
  style?: StyleProp<ViewStyle>;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  label,
  onPress,
  icon,
  disabled = false,
  loading = false,
  fullWidth = false,
  accessibilityLabel,
  style,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const isDisabled = disabled || loading;

  const handlePressIn = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  }, [scaleAnim]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  }, [scaleAnim]);

  const textColor =
    variant === 'primary'
      ? colors.onPrimary
      : variant === 'secondary'
        ? colors.onSurface
        : colors.primary;

  const iconColor = textColor;
  const spinnerColor = textColor;

  const renderContent = () => (
    <View style={styles.contentRow}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={spinnerColor}
          style={styles.spinner}
        />
      ) : icon ? (
        <Icon
          name={icon}
          size={20}
          color={iconColor}
          style={styles.iconLeft}
        />
      ) : null}
      <Text
        style={[
          styles.label,
          variant === 'tertiary' && styles.labelTertiary,
          { color: textColor },
          isDisabled && styles.labelDisabled,
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );

  const containerStyles: ViewStyle[] = [
    styles.base,
    variant === 'secondary' && styles.secondary,
    variant === 'tertiary' && styles.tertiary,
    fullWidth && styles.fullWidth,
    isDisabled && styles.disabled,
  ].filter(Boolean) as ViewStyle[];

  // Primary variant with gradient
  if (variant === 'primary') {
    const inner = (
      <View style={[styles.base, fullWidth && styles.fullWidth, isDisabled && styles.disabled, style]}>
        {LinearGradient ? (
          <LinearGradient
            colors={[colors.primary, colors.primaryDim]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={[styles.gradientInner, fullWidth && styles.fullWidth]}
          >
            {renderContent()}
          </LinearGradient>
        ) : (
          <View style={[styles.primaryFallback, fullWidth && styles.fullWidth]}>
            {renderContent()}
          </View>
        )}
      </View>
    );

    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Pressable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={isDisabled}
          accessibilityLabel={accessibilityLabel ?? label}
          accessibilityRole="button"
          accessibilityState={{ disabled: isDisabled, busy: loading }}
        >
          {inner}
        </Pressable>
      </Animated.View>
    );
  }

  // Secondary and tertiary variants
  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled, busy: loading }}
      >
        <View style={[containerStyles, style]}>
          {renderContent()}
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.xl,
    overflow: 'hidden',
  },
  gradientInner: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: radii.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryFallback: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: radii.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondary: {
    backgroundColor: colors.surfaceContainerHigh,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tertiary: {
    backgroundColor: 'transparent',
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.45,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...typography.labelLg,
    fontWeight: '600',
  },
  labelTertiary: {
    fontWeight: '600',
    color: colors.primary,
  },
  labelDisabled: {
    opacity: 0.7,
  },
  iconLeft: {
    marginRight: 8,
  },
  spinner: {
    marginRight: 8,
  },
});
