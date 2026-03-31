/**
 * ResponseInput
 *
 * Text area for pasting a company reply, with label and
 * "Analyze Response" button.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, TextArea } from '@/components/ui';
import { spacing } from '@/theme';

export interface ResponseInputProps {
  /** Current text value */
  value: string;
  /** Text change handler */
  onChangeText: (text: string) => void;
  /** Analyze button handler */
  onAnalyze: () => void;
  /** Whether analysis is in progress */
  isAnalyzing?: boolean;
}

export const ResponseInput: React.FC<ResponseInputProps> = ({
  value,
  onChangeText,
  onAnalyze,
  isAnalyzing = false,
}) => {
  const canAnalyze = value.trim().length > 0 && !isAnalyzing;

  return (
    <Card accessibilityLabel="Response input">
      <TextArea
        label="Company Response"
        placeholder="Paste the company's response here..."
        value={value}
        onChangeText={onChangeText}
        editable={!isAnalyzing}
        maxLength={5000}
        accessibilityLabel="Company response text"
      />
      <View style={styles.buttonContainer}>
        <Button
          variant="primary"
          label="Analyze Response"
          icon="analytics"
          onPress={onAnalyze}
          disabled={!canAnalyze}
          loading={isAnalyzing}
          fullWidth
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: spacing[4],
  },
});
