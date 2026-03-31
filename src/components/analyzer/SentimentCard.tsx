/**
 * SentimentCard
 *
 * Displays sentiment analysis result with large sentiment text,
 * error-colored progress bar, and explanation.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card, ProgressBar } from '@/components/ui';
import { colors, spacing, typography } from '@/theme';

export interface SentimentCardProps {
  /** Sentiment label (e.g. "Dismissive", "Cooperative") */
  sentiment: string;
  /** Sentiment score from 0 to 1 (0 = negative, 1 = positive) */
  score: number;
  /** Explanation of the sentiment */
  description: string;
}

export const SentimentCard: React.FC<SentimentCardProps> = ({
  sentiment,
  score,
  description,
}) => {
  return (
    <Card accessibilityLabel={`Sentiment: ${sentiment}, score ${Math.round(score * 100)}%`}>
      {/* Large sentiment label */}
      <Text style={styles.sentiment}>{sentiment}</Text>

      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <ProgressBar
          progress={score}
          variant="error"
          height={6}
        />
      </View>

      {/* Description */}
      <Text style={styles.description}>{description}</Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  sentiment: {
    ...typography.displaySm,
    color: colors.onSurface,
    marginBottom: spacing[4],
  },
  progressContainer: {
    marginBottom: spacing[4],
  },
  description: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    lineHeight: 24,
  },
});
