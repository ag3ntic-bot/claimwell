/**
 * AnalysisCard
 *
 * Main analysis result with insights icon + header, body with bold intro,
 * quoted text box, and two action buttons.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Card, Icon } from '@/components/ui';
import { colors, radii, spacing, typography } from '@/theme';

export interface AnalysisCardProps {
  /** AI analysis text (may contain a bold intro sentence) */
  analysis: string;
  /** Quoted text extracted from the company response */
  quotedText: string;
  /** Handler for generating a reply */
  onGenerateReply?: () => void;
  /** Handler for recommending escalation */
  onRecommendEscalation?: () => void;
}

export const AnalysisCard: React.FC<AnalysisCardProps> = ({
  analysis,
  quotedText,
  onGenerateReply,
  onRecommendEscalation,
}) => {
  return (
    <Card accessibilityLabel="AI Analysis">
      {/* Header */}
      <View style={styles.header}>
        <Icon
          name="info"
          size={20}
          color={colors.primary}
          style={styles.headerIcon}
        />
        <Text style={styles.headerText}>AI Analysis</Text>
      </View>

      {/* Analysis body */}
      <Text style={styles.analysisText}>{analysis}</Text>

      {/* Quoted text box */}
      {quotedText.length > 0 && (
        <View style={styles.quoteBox}>
          <View style={styles.quoteBar} />
          <Text style={styles.quoteText}>"{quotedText}"</Text>
        </View>
      )}

      {/* Action buttons */}
      <View style={styles.actions}>
        <Button
          variant="primary"
          label="Generate Reply"
          icon="edit"
          onPress={onGenerateReply}
          style={styles.actionButton}
        />
        <Button
          variant="secondary"
          label="Recommend Escalation"
          icon="trending_up"
          onPress={onRecommendEscalation}
          style={styles.actionButton}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  headerIcon: {
    marginRight: spacing[2],
  },
  headerText: {
    ...typography.titleMd,
    color: colors.primary,
  },
  analysisText: {
    ...typography.bodyLg,
    color: colors.onSurface,
    lineHeight: 26,
    marginBottom: spacing[4],
  },
  quoteBox: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radii.md,
    padding: spacing[4],
    marginBottom: spacing[5],
  },
  quoteBar: {
    width: 3,
    backgroundColor: colors.primary,
    borderRadius: 2,
    marginRight: spacing[3],
  },
  quoteText: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    fontStyle: 'italic',
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  actionButton: {
    flex: 1,
  },
});
