/**
 * EvidenceCard
 *
 * Evidence grid item showing thumbnail/icon with badge overlay,
 * title, type label, extracted data, AI conflict notes,
 * flags as chips, and a "View AI Summary" button.
 */

import React, { useCallback, useRef } from 'react';
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Button, Card, Chip, Icon } from '@/components/ui';
import { colors, radii, spacing, typography } from '@/theme';
import { Evidence, EVIDENCE_TYPE_META, EVIDENCE_FLAG_META } from '@/types';

/** Keys to display from extractedData, in label-friendly form. */
const EXTRACTED_DISPLAY_KEYS: Record<string, string> = {
  amount: 'Amount',
  chargeAmount: 'Amount',
  purchaseDate: 'Purchase Date',
  chargeDate: 'Charge Date',
  chatDate: 'Date',
  date: 'Date',
  store: 'Store',
  product: 'Product',
  agentName: 'Agent',
  outcome: 'Outcome',
  merchantName: 'Merchant',
  caseReference: 'Case Ref',
  denialReason: 'Denial Reason',
  warrantyPeriod: 'Warranty',
  coverageType: 'Coverage',
};

export interface EvidenceCardProps {
  /** The evidence item to display */
  evidence: Evidence;
  /** Press handler */
  onPress?: (evidence: Evidence) => void;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({
  evidence,
  onPress,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const typeMeta = EVIDENCE_TYPE_META[evidence.type];
  const isPhoto = evidence.type === 'photo' && evidence.thumbnailUri;
  const hasKeyEvidence = evidence.flags.includes('key_evidence');
  const hasContradiction = evidence.flags.includes('contradiction');

  const handlePressIn = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  }, [scaleAnim]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  }, [scaleAnim]);

  const handlePress = useCallback(() => {
    onPress?.(evidence);
  }, [evidence, onPress]);

  // Build extracted data entries to display (max 3 for card space)
  const extractedEntries = evidence.extractedData
    ? Object.entries(evidence.extractedData)
        .filter(([key]) => key in EXTRACTED_DISPLAY_KEYS)
        .slice(0, 3)
        .map(([key, value]) => ({
          label: EXTRACTED_DISPLAY_KEYS[key],
          value: typeof value === 'number' ? `$${value.toLocaleString()}` : String(value),
        }))
    : [];

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole="button"
        accessibilityLabel={`Evidence: ${evidence.title}, type ${typeMeta.label}`}
      >
        <Card>
          {/* Thumbnail or icon area */}
          {isPhoto ? (
            <View style={styles.thumbnailContainer}>
              <Image
                source={{ uri: evidence.thumbnailUri! }}
                style={styles.thumbnail}
                resizeMode="cover"
                accessibilityLabel={`Photo: ${evidence.title}`}
              />
              {/* Key Evidence badge overlay */}
              {hasKeyEvidence && (
                <View style={styles.badgeOverlay}>
                  <Icon name="star" size={12} color={colors.onPrimary} />
                  <Text style={styles.badgeText}>Key Evidence</Text>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.iconContainer}>
              <Icon
                name={typeMeta.icon}
                size={40}
                color={colors.primary}
              />
              {/* Key Evidence badge for non-photo cards */}
              {hasKeyEvidence && (
                <View style={styles.iconBadge}>
                  <Icon name="star" size={10} color={colors.onPrimary} />
                </View>
              )}
            </View>
          )}

          {/* Title */}
          <Text style={styles.title} numberOfLines={2}>
            {evidence.title}
          </Text>

          {/* Type label */}
          <Text style={styles.typeLabel}>{typeMeta.label}</Text>

          {/* Extracted data display */}
          {extractedEntries.length > 0 && (
            <View style={styles.extractedData}>
              {extractedEntries.map(({ label, value }) => (
                <View key={label} style={styles.extractedRow}>
                  <Text style={styles.extractedLabel}>{label}</Text>
                  <Text style={styles.extractedValue} numberOfLines={1}>
                    {value}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Flags row */}
          {evidence.flags.length > 0 && (
            <View style={styles.flagsRow}>
              {evidence.flags.map((flag) => {
                const flagMeta = EVIDENCE_FLAG_META[flag];
                return (
                  <Chip
                    key={flag}
                    label={flagMeta.label}
                    variant={flagMeta.variant}
                    size="sm"
                    style={styles.flagChip}
                  />
                );
              })}
            </View>
          )}

          {/* AI conflict note for contradiction/missing_info flags */}
          {hasContradiction && evidence.aiSummary && (
            <View style={styles.conflictNote}>
              <Icon name="warning" size={14} color={colors.error} />
              <Text style={styles.conflictText} numberOfLines={3}>
                {evidence.aiSummary.length > 120
                  ? evidence.aiSummary.slice(0, 120) + '...'
                  : evidence.aiSummary}
              </Text>
            </View>
          )}

          {/* View AI Summary button */}
          {evidence.aiSummary != null && (
            <Button
              variant="tertiary"
              label="View AI Summary"
              icon="visibility"
              onPress={handlePress}
              style={styles.summaryButton}
            />
          )}
        </Card>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  thumbnailContainer: {
    aspectRatio: 16 / 9,
    borderRadius: radii.md,
    overflow: 'hidden',
    marginBottom: spacing[3],
    backgroundColor: colors.surfaceContainerLow,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  badgeOverlay: {
    position: 'absolute',
    top: spacing[2],
    left: spacing[2],
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    backgroundColor: colors.primary,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: radii.sm,
  },
  badgeText: {
    ...typography.labelSm,
    color: colors.onPrimary,
    fontWeight: '600',
  },
  iconContainer: {
    height: 80,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[3],
  },
  iconBadge: {
    position: 'absolute',
    top: spacing[1.5],
    right: spacing[1.5],
    backgroundColor: colors.primary,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.titleSm,
    color: colors.onSurface,
    marginBottom: spacing[1],
  },
  typeLabel: {
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
    marginBottom: spacing[2],
  },
  extractedData: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radii.sm,
    padding: spacing[2],
    marginBottom: spacing[2],
    gap: spacing[1],
  },
  extractedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  extractedLabel: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
  },
  extractedValue: {
    ...typography.bodySm,
    color: colors.onSurface,
    fontWeight: '600',
    flexShrink: 1,
    textAlign: 'right',
    marginLeft: spacing[2],
  },
  flagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[1.5],
    marginBottom: spacing[2],
  },
  flagChip: {
    marginBottom: 0,
  },
  conflictNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[1.5],
    backgroundColor: `${colors.error}12`,
    borderRadius: radii.sm,
    padding: spacing[2],
    marginBottom: spacing[2],
  },
  conflictText: {
    ...typography.bodySm,
    color: colors.error,
    fontStyle: 'italic',
    flex: 1,
    lineHeight: 18,
  },
  summaryButton: {
    alignSelf: 'flex-start',
    marginTop: spacing[1],
  },
});
