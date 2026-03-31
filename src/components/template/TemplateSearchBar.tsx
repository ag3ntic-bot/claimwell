/**
 * TemplateSearchBar
 *
 * Full-width search input with search icon and placeholder.
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import { Input } from '@/components/ui';

export interface TemplateSearchBarProps {
  /** Current search value */
  value: string;
  /** Text change handler */
  onChangeText: (text: string) => void;
}

export const TemplateSearchBar: React.FC<TemplateSearchBarProps> = ({
  value,
  onChangeText,
}) => {
  return (
    <Input
      placeholder="Search all templates..."
      value={value}
      onChangeText={onChangeText}
      leftIcon="search"
      returnKeyType="search"
      autoCapitalize="none"
      accessibilityLabel="Search templates"
      style={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
