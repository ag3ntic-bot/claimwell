/**
 * AISummaryCard
 *
 * AI-generated summary with insights icon, italic quote text,
 * and key points list.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Icon } from '@/components/ui';
import { colors, radii, spacing, typography } from '@/theme';

export interface AISummaryCardProps {
  /** AI-generated summary text */
  summary: string;
  /** Key points extracted by AI */
  keyPoints: string[];
}

export const AISummaryCard: React.FC<AISummaryCardProps> = ({
  summary,
  keyPoints,
}) => {
  return (
    <View
      style={styles.container}
      accessibilityRole="text"
      accessibilityLabel={`AI Summary: ${summary}`}
    >
      {/* Header with icon */}
      <View style={styles.header}>
        <Icon
          name="info"
          size={20}
          color={colors.tertiary}
          style={styles.headerIcon}
        />
        <Text style={styles.headerText}>AI Insights</Text>
      </View>

      {/* Summary quote */}
      <Text style={styles.summary}>{summary}</Text>

      {/* Key points */}
      {keyPoints.length > 0 && (
        <View style={styles.keyPointsContainer}>
          {keyPoints.map((point, index) => (
            <View key={index} style={styles.keyPoint}>
              <View style={styles.bullet} />
              <Text style={styles.keyPointText}>{point}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: `${colors.tertiaryContainer}4D`, // 30% opacity
    borderRadius: radii.xl,
    padding: spacing[6],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  headerIcon: {
    marginRight: spacing[2],
  },
  headerText: {
    ...typography.labelLg,
    color: colors.tertiary,
  },
  summary: {
    ...typography.bodyLg,
    color: colors.onSurface,
    fontStyle: 'italic',
    marginBottom: spacing[4],
  },
  keyPointsContainer: {
    gap: spacing[2],
  },
  keyPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.tertiary,
    marginTop: 7,
    marginRight: spacing[3],
  },
  keyPointText: {
    ...typography.bodyMd,
    color: colors.onSurface,
    flex: 1,
  },
});
