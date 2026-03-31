/**
 * StatsGrid
 *
 * Three stat cards: Active Claims, Money at Stake, Recovered.
 * Each has a small label, large number, icon, and left border accent.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Icon } from '@/components/ui';
import { colors, radii, shadows, spacing, typography } from '@/theme';
import { ClaimSummary } from '@/types';

export interface StatsGridProps {
  /** Dashboard claim summary data */
  summary: ClaimSummary;
}

interface StatItemProps {
  label: string;
  value: string;
  icon: string;
  accentColor: string;
}

const StatItem: React.FC<StatItemProps> = ({
  label,
  value,
  icon,
  accentColor,
}) => (
  <View
    style={[styles.statCard, shadows.ambient]}
    accessibilityRole="text"
    accessibilityLabel={`${label}: ${value}`}
  >
    <View style={[styles.accent, { backgroundColor: accentColor }]} />
    <View style={styles.statContent}>
      <View style={styles.statHeader}>
        <Text style={styles.statLabel}>{label}</Text>
        <Icon name={icon} size={18} color={colors.onSurfaceVariant} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  </View>
);

const formatCurrency = (amount: number): string => {
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}k`;
  }
  return `$${amount.toLocaleString('en-US')}`;
};

export const StatsGrid: React.FC<StatsGridProps> = ({ summary }) => {
  return (
    <View
      style={styles.grid}
      testID="stats-grid"
      accessibilityRole="summary"
      accessibilityLabel="Claims summary statistics"
    >
      <StatItem
        label="Active Claims"
        value={String(summary.activeClaims)}
        icon="description"
        accentColor={colors.primary}
      />
      <StatItem
        label="Money at Stake"
        value={formatCurrency(summary.moneyAtStake)}
        icon="attach_money"
        accentColor={colors.tertiary}
      />
      <StatItem
        label="Recovered"
        value={formatCurrency(summary.totalRecovered)}
        icon="trending_up"
        accentColor="#4CAF50"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radii.xl,
    overflow: 'hidden',
  },
  accent: {
    width: 4,
    borderTopLeftRadius: radii.xl,
    borderBottomLeftRadius: radii.xl,
  },
  statContent: {
    flex: 1,
    padding: spacing[4],
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  statLabel: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
  },
  statValue: {
    ...typography.headlineSm,
    color: colors.onSurface,
  },
});
