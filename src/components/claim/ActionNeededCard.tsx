/**
 * ActionNeededCard
 *
 * Urgent action item with icon on the left, text + chevron on the right.
 * Supports error and primary variants.
 */

import React, { useCallback, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Icon } from '@/components/ui';
import { colors, radii, shadows, spacing, typography } from '@/theme';

export interface ActionNeededCardProps {
  /** Action title */
  title: string;
  /** Action description */
  description: string;
  /** Visual variant determining the accent color */
  variant: 'error' | 'primary';
  /** Press handler */
  onPress?: () => void;
}

const VARIANT_COLORS = {
  error: {
    icon: colors.error,
    iconBg: `${colors.errorContainer}66`,
    accent: colors.error,
  },
  primary: {
    icon: colors.primary,
    iconBg: `${colors.primaryContainer}66`,
    accent: colors.primary,
  },
} as const;

export const ActionNeededCard: React.FC<ActionNeededCardProps> = ({
  title,
  description,
  variant,
  onPress,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const variantColors = VARIANT_COLORS[variant];

  const handlePressIn = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
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

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole="button"
        accessibilityLabel={`Action needed: ${title}. ${description}`}
      >
        <View style={[styles.container, shadows.ambient]}>
          {/* Left icon */}
          <View style={[styles.iconContainer, { backgroundColor: variantColors.iconBg }]}>
            <Icon
              name={variant === 'error' ? 'warning' : 'info'}
              size={22}
              color={variantColors.icon}
            />
          </View>

          {/* Text content */}
          <View style={styles.textContent}>
            <Text style={[styles.title, { color: variantColors.accent }]}>
              {title}
            </Text>
            <Text style={styles.description} numberOfLines={2}>
              {description}
            </Text>
          </View>

          {/* Chevron */}
          <Icon
            name="chevron_right"
            size={20}
            color={colors.onSurfaceVariant}
          />
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radii.xl,
    padding: spacing[4],
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },
  textContent: {
    flex: 1,
    marginRight: spacing[2],
  },
  title: {
    ...typography.titleSm,
    marginBottom: spacing[0.5],
  },
  description: {
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
  },
});
