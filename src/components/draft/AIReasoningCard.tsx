/**
 * AIReasoningCard
 *
 * Shows AI reasoning for the chosen draft tone.
 * Tertiary-container background at 30% opacity, insights icon, body text.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Icon } from '@/components/ui';
import { colors, radii, spacing, typography } from '@/theme';

export interface AIReasoningCardProps {
  /** The AI reasoning text explaining why this tone was chosen */
  reasoning: string;
}

export const AIReasoningCard: React.FC<AIReasoningCardProps> = ({
  reasoning,
}) => {
  return (
    <View
      style={styles.container}
      accessibilityRole="text"
      accessibilityLabel={`AI reasoning: ${reasoning}`}
    >
      <View style={styles.header}>
        <Icon
          name="info"
          size={20}
          color={colors.tertiary}
          style={styles.icon}
        />
        <Text style={styles.headerText}>AI Reasoning</Text>
      </View>
      <Text style={styles.body}>{reasoning}</Text>
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
  icon: {
    marginRight: spacing[2],
  },
  headerText: {
    ...typography.labelLg,
    color: colors.tertiary,
  },
  body: {
    ...typography.bodyMd,
    color: colors.onSurface,
    lineHeight: 24,
  },
});
