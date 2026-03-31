/**
 * DraftEditor
 *
 * Rich text display area with header bar (version/status),
 * content area, and footer with Copy/Save/Regenerate buttons.
 */

import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Badge, Button, Card } from '@/components/ui';
import { colors, radii, spacing, typography } from '@/theme';

export interface DraftEditorProps {
  /** The draft letter content */
  content: string;
  /** Draft version label (e.g. "v1.2") */
  version: string;
  /** Copy content handler */
  onCopy?: () => void;
  /** Save draft handler */
  onSave?: () => void;
  /** Regenerate draft handler */
  onRegenerate?: () => void;
}

export const DraftEditor: React.FC<DraftEditorProps> = ({
  content,
  version,
  onCopy,
  onSave,
  onRegenerate,
}) => {
  return (
    <Card
      style={styles.card}
      accessibilityLabel={`Draft editor, version ${version}`}
    >
      {/* Header bar */}
      <View style={styles.header}>
        <Badge label={`Version ${version}`} variant="secondary" />
        <Badge label="Draft" variant="primary" />
      </View>

      {/* Content area */}
      <View style={styles.contentContainer}>
        <ScrollView
          style={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          accessibilityRole="text"
          accessibilityLabel="Draft content"
        >
          <Text style={styles.contentText} selectable>
            {content}
          </Text>
        </ScrollView>
      </View>

      {/* Footer with actions */}
      <View style={styles.footer}>
        <Button
          variant="secondary"
          label="Copy"
          icon="copy"
          onPress={onCopy}
        />
        <Button
          variant="secondary"
          label="Save"
          icon="download"
          onPress={onSave}
        />
        <Button
          variant="primary"
          label="Regenerate"
          icon="refresh"
          onPress={onRegenerate}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 0,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[4],
    backgroundColor: colors.surfaceContainerLow,
  },
  contentContainer: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radii.xl,
    margin: spacing[4],
    maxHeight: 400,
  },
  scrollContent: {
    padding: spacing[6],
  },
  contentText: {
    ...typography.bodyLg,
    color: colors.onSurface,
    lineHeight: 28,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing[3],
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[4],
    backgroundColor: colors.surfaceContainerLow,
  },
});
