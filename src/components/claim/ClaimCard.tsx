/**
 * ClaimCard
 *
 * Dashboard claim card showing title, status chip, date, amount,
 * and a progress bar with percentage.
 */

import React, { useCallback, useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Card, Icon, ProgressBar } from '@/components/ui';
import { colors, spacing, typography } from '@/theme';
import { Claim } from '@/types';
import { ClaimStatusBadge } from './ClaimStatusBadge';

export interface ClaimCardProps {
  /** The claim data to display */
  claim: Claim;
  /** Press handler for navigating to claim detail */
  onPress?: (claim: Claim) => void;
}

export const ClaimCard: React.FC<ClaimCardProps> = ({ claim, onPress }) => {
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

  const handlePress = useCallback(() => {
    onPress?.(claim);
  }, [claim, onPress]);

  const progressPercent = Math.round(claim.resolutionProgress * 100);
  const formattedDate = new Date(claim.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedAmount = `$${claim.amountClaimed.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole="button"
        accessibilityLabel={`Claim: ${claim.title}, status ${claim.status}, ${progressPercent}% progress`}
      >
        <Card>
          {/* Top row: title + status badge */}
          <View style={styles.topRow}>
            <Text style={styles.title} numberOfLines={1}>
              {claim.title}
            </Text>
            <ClaimStatusBadge status={claim.status} size="sm" />
          </View>

          {/* Mid row: date + amount */}
          <View style={styles.midRow}>
            <View style={styles.metaItem}>
              <Icon
                name="calendar_today"
                size={16}
                color={colors.onSurfaceVariant}
                style={styles.metaIcon}
              />
              <Text style={styles.metaText}>{formattedDate}</Text>
            </View>
            <View style={styles.metaItem}>
              <Icon
                name="attach_money"
                size={16}
                color={colors.onSurfaceVariant}
                style={styles.metaIcon}
              />
              <Text style={styles.metaText}>{formattedAmount}</Text>
            </View>
          </View>

          {/* Bottom: progress bar with percentage */}
          <View style={styles.progressRow}>
            <ProgressBar
              progress={claim.resolutionProgress}
              style={styles.progressBar}
            />
            <Text style={styles.progressText}>{progressPercent}%</Text>
          </View>
        </Card>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing[3],
  },
  title: {
    ...typography.titleMd,
    color: colors.onSurface,
    flex: 1,
    marginRight: spacing[3],
  },
  midRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[4],
    gap: spacing[5],
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaIcon: {
    marginRight: spacing[1],
  },
  metaText: {
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    marginRight: spacing[3],
  },
  progressText: {
    ...typography.labelMd,
    color: colors.primary,
    minWidth: 36,
    textAlign: 'right',
  },
});
