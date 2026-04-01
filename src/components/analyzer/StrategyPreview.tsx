/**
 * StrategyPreview
 *
 * Strategy draft preview with auto_awesome icon heading,
 * gradient-style card, numbered strategy points, and CTA.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Card, Icon } from '@/components/ui';
import { colors, spacing, typography } from '@/theme';

export interface StrategyPreviewProps {
  /** Strategy draft text (lines separated by newlines become numbered points) */
  draft: string;
  /** Handler for viewing the full template */
  onViewFullTemplate?: () => void;
}

export const StrategyPreview: React.FC<StrategyPreviewProps> = ({
  draft,
  onViewFullTemplate,
}) => {
  const points = draft
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  return (
    <Card
      style={styles.card}
      accessibilityLabel="Strategy preview"
    >
      {/* Background overlay */}
      <View style={styles.overlay} />

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Icon
            name="star"
            size={22}
            color={colors.primary}
            style={styles.headerIcon}
          />
          <Text style={styles.headerText}>Suggested Strategy</Text>
        </View>

        {/* Numbered points */}
        <View style={styles.points}>
          {points.map((point, index) => (
            <View key={index} style={styles.pointRow}>
              <View style={styles.pointNumber}>
                <Text style={styles.pointNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.pointText}>{point}</Text>
            </View>
          ))}
        </View>

        {/* CTA */}
        <Button
          variant="primary"
          label="View Full Template"
          icon="description"
          onPress={onViewFullTemplate}
          fullWidth
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 0,
    overflow: 'hidden',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.primaryContainer,
    opacity: 0.1,
  },
  content: {
    padding: spacing[6],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[5],
  },
  headerIcon: {
    marginRight: spacing[2],
  },
  headerText: {
    ...typography.titleLg,
    color: colors.onSurface,
  },
  points: {
    marginBottom: spacing[6],
    gap: spacing[4],
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  pointNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
    marginTop: spacing[0.5],
  },
  pointNumberText: {
    ...typography.labelMd,
    color: colors.onPrimary,
    fontWeight: '700',
  },
  pointText: {
    ...typography.bodyMd,
    color: colors.onSurface,
    flex: 1,
    lineHeight: 24,
  },
});
