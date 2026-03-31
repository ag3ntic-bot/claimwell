/**
 * WinProbability
 *
 * Win probability display with primary background,
 * large percentage text, progress bar, and contextual description.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ProgressBar } from '@/components/ui';
import { colors, radii, spacing, typography } from '@/theme';

export interface WinProbabilityProps {
  /** Probability from 0 to 100 */
  probability: number;
  /** Contextual description text */
  description: string;
}

export const WinProbability: React.FC<WinProbabilityProps> = ({
  probability,
  description,
}) => {
  const clamped = Math.min(100, Math.max(0, Math.round(probability)));

  return (
    <View
      style={styles.container}
      accessibilityRole="text"
      accessibilityLabel={`Win probability: ${clamped}%. ${description}`}
    >
      {/* Large percentage */}
      <Text style={styles.percentage}>{clamped}%</Text>

      {/* Progress bar */}
      <View style={styles.progressWrapper}>
        <ProgressBar
          progress={clamped / 100}
          variant="primary"
          height={6}
          style={styles.progressBar}
        />
      </View>

      {/* Description */}
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    borderRadius: radii.xl,
    padding: spacing[6],
    alignItems: 'center',
  },
  percentage: {
    ...typography.displayLg,
    color: colors.onPrimary,
    marginBottom: spacing[3],
  },
  progressWrapper: {
    width: '100%',
    marginBottom: spacing[4],
  },
  progressBar: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  description: {
    ...typography.bodyMd,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
  },
});
