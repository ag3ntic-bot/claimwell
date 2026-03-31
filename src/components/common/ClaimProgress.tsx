/**
 * ClaimProgress
 *
 * Step progress indicator for the claim wizard.
 * Shows "Step N of M" label and a 4px progress bar.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ProgressBar } from '@/components/ui';
import { colors, spacing, typography } from '@/theme';

export interface ClaimProgressProps {
  /** Current step (1-based) */
  currentStep: number;
  /** Total number of steps */
  totalSteps: number;
}

export const ClaimProgress: React.FC<ClaimProgressProps> = ({
  currentStep,
  totalSteps,
}) => {
  const clamped = Math.min(totalSteps, Math.max(1, currentStep));
  const progress = clamped / totalSteps;

  return (
    <View
      style={styles.container}
      accessibilityRole="progressbar"
      accessibilityLabel={`Step ${clamped} of ${totalSteps}`}
      accessibilityValue={{
        min: 1,
        max: totalSteps,
        now: clamped,
      }}
    >
      <Text style={styles.label}>
        Step {clamped} of {totalSteps}
      </Text>
      <ProgressBar progress={progress} height={4} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
    marginBottom: spacing[2],
  },
});
