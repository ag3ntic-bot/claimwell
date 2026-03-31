/**
 * EvidenceGrid
 *
 * Grid of EvidenceCards with an upload placeholder card
 * (dashed border, upload icon, "Add Evidence" text).
 */

import React from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  ListRenderItemInfo,
} from 'react-native';
import { CardSkeleton, Icon } from '@/components/ui';
import { colors, radii, spacing, typography } from '@/theme';
import { Evidence } from '@/types';
import { EvidenceCard } from './EvidenceCard';

export interface EvidenceGridProps {
  /** List of evidence items */
  evidence: Evidence[];
  /** Handler when an evidence item is pressed */
  onEvidencePress?: (evidence: Evidence) => void;
  /** Handler for the upload placeholder press */
  onUploadPress?: () => void;
  /** Show loading skeletons */
  isLoading?: boolean;
}

const COLUMN_COUNT = 2;

const UploadPlaceholder: React.FC<{ onPress?: () => void }> = ({ onPress }) => (
  <Pressable
    style={styles.uploadCard}
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel="Add evidence"
  >
    <Icon name="upload" size={32} color={colors.onSurfaceVariant} />
    <Text style={styles.uploadText}>Add Evidence</Text>
  </Pressable>
);

export const EvidenceGrid: React.FC<EvidenceGridProps> = ({
  evidence,
  onEvidencePress,
  onUploadPress,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <View style={styles.skeletonGrid}>
        {[0, 1, 2, 3].map((i) => (
          <View key={i} style={styles.gridItem}>
            <CardSkeleton />
          </View>
        ))}
      </View>
    );
  }

  const renderItem = ({ item }: ListRenderItemInfo<Evidence>) => (
    <View style={styles.gridItem}>
      <EvidenceCard evidence={item} onPress={onEvidencePress} />
    </View>
  );

  const renderHeader = () => (
    <View style={styles.gridItem}>
      <UploadPlaceholder onPress={onUploadPress} />
    </View>
  );

  return (
    <FlatList
      data={evidence}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={COLUMN_COUNT}
      ListHeaderComponent={renderHeader}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      accessibilityRole="list"
      accessibilityLabel="Evidence items"
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing[4],
  },
  row: {
    gap: spacing[3],
  },
  gridItem: {
    flex: 1,
    marginBottom: spacing[3],
  },
  skeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
  },
  uploadCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radii.xl,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.outlineVariant,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[6],
    minHeight: 160,
  },
  uploadText: {
    ...typography.labelLg,
    color: colors.onSurfaceVariant,
    marginTop: spacing[2],
  },
});
