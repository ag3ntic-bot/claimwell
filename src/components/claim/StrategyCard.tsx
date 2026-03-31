/**
 * StrategyCard
 *
 * Recommended action card with prominent heading, description,
 * "Recommended Next Action" badge, and two action buttons.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Badge, Button, Card } from '@/components/ui';
import { colors, spacing, typography } from '@/theme';
import { Strategy } from '@/types';

export interface StrategyCardProps {
  /** The strategy data */
  strategy: Strategy;
  /** Handler for generate letter action */
  onGenerateLetter?: () => void;
  /** Handler for view templates action */
  onViewTemplates?: () => void;
}

export const StrategyCard: React.FC<StrategyCardProps> = ({
  strategy,
  onGenerateLetter,
  onViewTemplates,
}) => {
  return (
    <Card
      style={styles.card}
      accessibilityLabel={`Strategy: ${strategy.recommendedAction}`}
    >
      {/* Gradient-like background overlay via inner surface */}
      <View style={styles.innerOverlay} />

      <View style={styles.content}>
        {/* Badge */}
        <Badge
          label="Recommended Next Action"
          variant="tertiary"
          icon="star"
          style={styles.badge}
        />

        {/* Heading */}
        <Text style={styles.heading}>{strategy.recommendedAction}</Text>

        {/* Description */}
        <Text style={styles.description}>{strategy.actionDescription}</Text>

        {/* Action buttons */}
        <View style={styles.actions}>
          <Button
            variant="primary"
            label="Generate Letter"
            icon="edit"
            onPress={onGenerateLetter}
            style={styles.primaryAction}
          />
          <Button
            variant="secondary"
            label="View Templates"
            onPress={onViewTemplates}
          />
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    padding: 0,
  },
  innerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.primaryContainer,
    opacity: 0.15,
  },
  content: {
    padding: spacing[6],
  },
  badge: {
    marginBottom: spacing[4],
  },
  heading: {
    ...typography.headlineSm,
    color: colors.onSurface,
    marginBottom: spacing[2.5],
  },
  description: {
    ...typography.bodyLg,
    color: colors.onSurfaceVariant,
    marginBottom: spacing[6],
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  primaryAction: {
    flex: 1,
  },
});
