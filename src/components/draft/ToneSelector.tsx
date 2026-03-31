/**
 * ToneSelector
 *
 * Three tone buttons (Calm, Assertive, Formal).
 * Active button shows primary background + check icon.
 */

import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Icon } from '@/components/ui';
import { colors, radii, spacing, typography } from '@/theme';
import { DraftTone, DRAFT_TONE_META } from '@/types';

export interface ToneSelectorProps {
  /** Currently selected tone */
  selectedTone: DraftTone;
  /** Selection handler */
  onSelect: (tone: DraftTone) => void;
}

const TONES: DraftTone[] = ['calm', 'assertive', 'formal'];

const ToneButton: React.FC<{
  tone: DraftTone;
  isSelected: boolean;
  onPress: (tone: DraftTone) => void;
}> = ({ tone, isSelected, onPress }) => {
  const meta = DRAFT_TONE_META[tone];

  const handlePress = useCallback(() => {
    onPress(tone);
  }, [tone, onPress]);

  return (
    <Pressable
      style={[styles.button, isSelected && styles.buttonSelected]}
      onPress={handlePress}
      accessibilityRole="radio"
      accessibilityState={{ selected: isSelected }}
      accessibilityLabel={`${meta.label} tone: ${meta.description}`}
    >
      {isSelected && (
        <Icon
          name="check"
          size={16}
          color={colors.onPrimary}
          style={styles.checkIcon}
        />
      )}
      <Text
        style={[styles.buttonLabel, isSelected && styles.buttonLabelSelected]}
      >
        {meta.label}
      </Text>
    </Pressable>
  );
};

export const ToneSelector: React.FC<ToneSelectorProps> = ({
  selectedTone,
  onSelect,
}) => {
  return (
    <View
      style={styles.container}
      testID="tone-selector-group"
      accessibilityRole="radiogroup"
      accessibilityLabel="Select draft tone"
    >
      {TONES.map((tone) => (
        <ToneButton
          key={tone}
          tone={tone}
          isSelected={selectedTone === tone}
          onPress={onSelect}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: radii.md,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
  },
  buttonSelected: {
    backgroundColor: colors.primary,
  },
  checkIcon: {
    marginRight: spacing[1.5],
  },
  buttonLabel: {
    ...typography.labelLg,
    color: colors.onSurface,
  },
  buttonLabelSelected: {
    color: colors.onPrimary,
  },
});
