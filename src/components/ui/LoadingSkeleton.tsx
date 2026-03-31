/**
 * LoadingSkeleton component
 *
 * Animated shimmer skeleton placeholder.
 * Also exports CardSkeleton and ListItemSkeleton composed variants.
 */

import React, { useEffect, useRef } from 'react';
import {
  Animated,
  DimensionValue,
  StyleSheet,
  View,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { colors, radii, spacing, shadows } from '@/theme';

export interface LoadingSkeletonProps {
  /** Width of the skeleton. Default '100%'. */
  width?: number | string;
  /** Height of the skeleton. Default 16. */
  height?: number;
  /** Border radius. Default md (12). */
  borderRadius?: number;
  /** Optional style overrides */
  style?: StyleProp<ViewStyle>;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  width = '100%',
  height = 16,
  borderRadius = radii.md,
  style,
}) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [shimmerAnim]);

  const backgroundColor = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.surfaceContainerLow, colors.surfaceContainerHigh],
  });

  return (
    <Animated.View
      style={[
        {
          width: width as DimensionValue,
          height,
          borderRadius,
          backgroundColor,
        },
        style,
      ]}
      accessibilityRole="progressbar"
      accessibilityLabel="Loading"
    />
  );
};

// -- Composed Skeletons --

export interface CardSkeletonProps {
  style?: StyleProp<ViewStyle>;
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({ style }) => {
  return (
    <View style={[skeletonStyles.card, style]}>
      <View style={skeletonStyles.cardHeader}>
        <LoadingSkeleton width={48} height={48} borderRadius={24} />
        <View style={skeletonStyles.cardHeaderText}>
          <LoadingSkeleton width="60%" height={14} />
          <LoadingSkeleton width="40%" height={10} style={skeletonStyles.spacerSm} />
        </View>
      </View>
      <LoadingSkeleton width="100%" height={12} style={skeletonStyles.spacerMd} />
      <LoadingSkeleton width="80%" height={12} style={skeletonStyles.spacerSm} />
      <LoadingSkeleton width="50%" height={12} style={skeletonStyles.spacerSm} />
    </View>
  );
};

export interface ListItemSkeletonProps {
  style?: StyleProp<ViewStyle>;
}

export const ListItemSkeleton: React.FC<ListItemSkeletonProps> = ({ style }) => {
  return (
    <View style={[skeletonStyles.listItem, style]}>
      <LoadingSkeleton width={40} height={40} borderRadius={20} />
      <View style={skeletonStyles.listItemText}>
        <LoadingSkeleton width="70%" height={14} />
        <LoadingSkeleton width="45%" height={10} style={skeletonStyles.spacerSm} />
      </View>
      <LoadingSkeleton width={60} height={24} borderRadius={radii.full} />
    </View>
  );
};

const skeletonStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radii.xl,
    padding: spacing[6],
    ...shadows.ambient,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardHeaderText: {
    flex: 1,
    marginLeft: spacing[3],
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
  },
  listItemText: {
    flex: 1,
    marginLeft: spacing[3],
  },
  spacerSm: {
    marginTop: spacing[1.5],
  },
  spacerMd: {
    marginTop: spacing[4],
  },
});
