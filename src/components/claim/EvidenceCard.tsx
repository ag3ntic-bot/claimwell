/**
 * EvidenceCard
 *
 * Evidence grid item showing thumbnail/icon, title, type label,
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
            </View>
          ) : (
            <View style={styles.iconContainer}>
              <Icon
                name={typeMeta.icon}
                size={40}
                color={colors.primary}
              />
            </View>
          )}

          {/* Title */}
          <Text style={styles.title} numberOfLines={2}>
            {evidence.title}
          </Text>

          {/* Type label */}
          <Text style={styles.typeLabel}>{typeMeta.label}</Text>

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
  iconContainer: {
    height: 80,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[3],
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
  flagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[1.5],
    marginBottom: spacing[2],
  },
  flagChip: {
    marginBottom: 0,
  },
  summaryButton: {
    alignSelf: 'flex-start',
    marginTop: spacing[1],
  },
});
