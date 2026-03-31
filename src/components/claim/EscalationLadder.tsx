/**
 * EscalationLadder
 *
 * Vertical escalation steps with a connecting line.
 * Completed steps show primary circle + check icon.
 * Active step shows primary border + animated pulse dot.
 * Pending steps show gray outline circle.
 */

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Icon } from '@/components/ui';
import { colors, spacing, typography } from '@/theme';
import { EscalationStep, EscalationStepStatus } from '@/types';

export interface EscalationLadderProps {
  /** Ordered list of escalation steps */
  steps: EscalationStep[];
}

const CIRCLE_SIZE = 32;
const LINE_WIDTH = 2;

/** Animated pulsing dot for active step */
const PulseDot: React.FC = () => {
  const pulseAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.4,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [pulseAnim]);

  return (
    <Animated.View
      style={[styles.pulseDot, { opacity: pulseAnim }]}
    />
  );
};

const StepCircle: React.FC<{ status: EscalationStepStatus }> = ({ status }) => {
  if (status === 'completed') {
    return (
      <View
        style={[styles.circle, styles.circleCompleted]}
        accessibilityLabel="Completed"
      >
        <Icon name="check" size={16} color={colors.onPrimary} />
      </View>
    );
  }

  if (status === 'active') {
    return (
      <View
        style={[styles.circle, styles.circleActive]}
        accessibilityLabel="Active"
      >
        <PulseDot />
      </View>
    );
  }

  return (
    <View
      style={[styles.circle, styles.circlePending]}
      accessibilityLabel="Pending"
    />
  );
};

export const EscalationLadder: React.FC<EscalationLadderProps> = ({
  steps,
}) => {
  return (
    <View
      style={styles.container}
      accessibilityRole="list"
      accessibilityLabel="Escalation ladder"
    >
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;

        return (
          <View
            key={step.order}
            style={styles.stepRow}
            accessibilityRole="text"
            accessibilityLabel={`Step ${step.order}: ${step.title}, ${step.status}`}
          >
            {/* Left: circle + connecting line */}
            <View style={styles.leftColumn}>
              <StepCircle status={step.status} />
              {!isLast && (
                <View
                  style={[
                    styles.line,
                    step.status === 'completed'
                      ? styles.lineCompleted
                      : styles.linePending,
                  ]}
                />
              )}
            </View>

            {/* Right: content */}
            <View style={styles.stepContent}>
              <Text
                style={[
                  styles.stepTitle,
                  step.status === 'pending' && styles.stepTitlePending,
                ]}
              >
                {step.title}
              </Text>
              <Text style={styles.stepDescription}>{step.description}</Text>
              {step.date && (
                <Text style={styles.stepDate}>
                  {new Date(step.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing[2],
  },
  stepRow: {
    flexDirection: 'row',
  },
  leftColumn: {
    width: CIRCLE_SIZE,
    alignItems: 'center',
    marginRight: spacing[4],
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleCompleted: {
    backgroundColor: colors.primary,
  },
  circleActive: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  circlePending: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.outlineVariant,
  },
  pulseDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  line: {
    width: LINE_WIDTH,
    flex: 1,
    minHeight: 24,
  },
  lineCompleted: {
    backgroundColor: colors.primary,
  },
  linePending: {
    backgroundColor: colors.surfaceContainerHigh,
  },
  stepContent: {
    flex: 1,
    paddingBottom: spacing[5],
    paddingTop: spacing[1],
  },
  stepTitle: {
    ...typography.titleSm,
    color: colors.onSurface,
    marginBottom: spacing[0.5],
  },
  stepTitlePending: {
    color: colors.onSurfaceVariant,
  },
  stepDescription: {
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
  },
  stepDate: {
    ...typography.bodySm,
    color: colors.outline,
    marginTop: spacing[1],
  },
});
