/**
 * TemplateCategoryCard
 *
 * Template category card with large icon, title, description,
 * tags row, and "View N Templates" link. Has a special "featured"
 * variant with primary background.
 */

import React, { useCallback, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Chip, Icon } from '@/components/ui';
import { colors, radii, shadows, spacing, typography } from '@/theme';
import { TemplateCategory, TEMPLATE_CATEGORY_META } from '@/types';

export interface TemplateCategoryCardProps {
  /** Template category identifier */
  category: TemplateCategory;
  /** Press handler */
  onPress?: (category: TemplateCategory) => void;
  /** Featured variant uses primary background */
  featured?: boolean;
}

export const TemplateCategoryCard: React.FC<TemplateCategoryCardProps> = ({
  category,
  onPress,
  featured = false,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const meta = TEMPLATE_CATEGORY_META[category];

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

  const handlePress = useCallback(() => {
    onPress?.(category);
  }, [category, onPress]);

  const textColor = featured ? colors.onPrimary : colors.onSurface;
  const subtextColor = featured ? 'rgba(255,255,255,0.75)' : colors.onSurfaceVariant;
  const iconBg = featured ? 'rgba(255,255,255,0.15)' : colors.surfaceContainerLow;
  const iconColor = featured ? colors.onPrimary : colors.primary;

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole="button"
        accessibilityLabel={`${meta.label}: ${meta.description}. ${meta.count} templates.`}
      >
        <View
          style={[
            styles.card,
            shadows.ambient,
            featured ? styles.cardFeatured : styles.cardDefault,
          ]}
        >
          {/* Icon */}
          <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
            <Icon name={meta.icon} size={28} color={iconColor} />
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: textColor }]}>
            {meta.label}
          </Text>

          {/* Description */}
          <Text style={[styles.description, { color: subtextColor }]}>
            {meta.description}
          </Text>

          {/* Tags row - using category name split for demo tags */}
          <View style={styles.tagsRow}>
            <Chip
              label={category}
              size="sm"
              variant={featured ? 'secondary' : 'primary'}
            />
          </View>

          {/* View templates link */}
          <View style={styles.linkRow}>
            <Text style={[styles.linkText, { color: featured ? 'rgba(255,255,255,0.9)' : colors.primary }]}>
              View {meta.count} Templates
            </Text>
            <Icon
              name="chevron_right"
              size={16}
              color={featured ? 'rgba(255,255,255,0.9)' : colors.primary}
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
    padding: spacing[6],
  },
  cardDefault: {
    backgroundColor: colors.surfaceContainerLowest,
  },
  cardFeatured: {
    backgroundColor: colors.primary,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[4],
  },
  title: {
    ...typography.titleLg,
    marginBottom: spacing[2],
  },
  description: {
    ...typography.bodyMd,
    lineHeight: 22,
    marginBottom: spacing[4],
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
    marginBottom: spacing[4],
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkText: {
    ...typography.labelLg,
    marginRight: spacing[1],
  },
});
