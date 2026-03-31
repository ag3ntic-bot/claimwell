/**
 * StrategyInsightCard
 *
 * Bottom insight card with primary-dim background,
 * heading, description, AI icon, and CTA button.
 */

import React, { useCallback, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Button, Icon } from '@/components/ui';
import { colors, radii, spacing, typography } from '@/theme';

export interface StrategyInsightCardProps {
  /** Card heading */
  title: string;
  /** Card description */
  description: string;
  /** CTA press handler */
  onPress?: () => void;
}

export const StrategyInsightCard: React.FC<StrategyInsightCardProps> = ({
  title,
  description,
  onPress,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

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
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole="button"
        accessibilityLabel={`${title}. ${description}`}
      >
        <View style={styles.card}>
          {/* Gradient overlay simulation */}
          <View style={styles.gradientOverlay} />

          <View style={styles.content}>
            {/* AI icon */}
            <View style={styles.iconContainer}>
              <Icon name="star" size={24} color="rgba(255,255,255,0.9)" />
            </View>

            {/* Text */}
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>

            {/* CTA */}
            <Button
              variant="secondary"
              label="View Strategy"
              icon="chevron_right"
              onPress={onPress}
              style={styles.ctaButton}
            />
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.xl,
    backgroundColor: colors.primaryDim,
    overflow: 'hidden',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.primary,
    opacity: 0.3,
  },
  content: {
    padding: spacing[6],
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[4],
  },
  title: {
    ...typography.titleLg,
    color: colors.onPrimary,
    marginBottom: spacing[2],
  },
  description: {
    ...typography.bodyMd,
    color: 'rgba(255,255,255,0.75)',
    marginBottom: spacing[5],
    lineHeight: 22,
  },
  ctaButton: {
    alignSelf: 'flex-start',
  },
});
