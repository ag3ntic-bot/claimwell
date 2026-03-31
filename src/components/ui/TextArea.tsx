/**
 * TextArea component
 *
 * Multi-line variant of Input with min height 120.
 * Same styling rules as Input.
 */

import React, { useCallback, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { colors, radii, spacing, typography } from '@/theme';

export interface TextAreaProps {
  /** Optional label above the textarea */
  label?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Controlled value */
  value?: string;
  /** Change handler */
  onChangeText?: (text: string) => void;
  /** Error message */
  error?: string;
  /** Maximum character length */
  maxLength?: number;
  /** Disabled state */
  editable?: boolean;
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Container style */
  style?: StyleProp<ViewStyle>;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  maxLength,
  editable = true,
  accessibilityLabel,
  style,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    Animated.timing(borderAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [borderAnim]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    Animated.timing(borderAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [borderAnim]);

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['transparent', `${colors.primary}66`],
  });

  const backgroundColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.surfaceContainerHighest, colors.surfaceContainerLowest],
  });

  const hasError = !!error;
  const charCount = value?.length ?? 0;

  return (
    <View style={[styles.wrapper, style]}>
      {label ? (
        <Text style={styles.label}>{label}</Text>
      ) : null}
      <Animated.View
        style={[
          styles.inputContainer,
          {
            backgroundColor,
            borderColor: hasError ? colors.error : borderColor,
            borderWidth: 1,
          },
        ]}
      >
        <TextInput
          style={[styles.input, !editable && styles.inputDisabled]}
          placeholder={placeholder}
          placeholderTextColor={colors.onSurfaceVariant}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          multiline
          maxLength={maxLength}
          editable={editable}
          textAlignVertical="top"
          accessibilityLabel={accessibilityLabel ?? label ?? placeholder}
          accessibilityRole="text"
          accessibilityState={{ disabled: !editable }}
        />
      </Animated.View>
      <View style={styles.footer}>
        {hasError ? (
          <Text style={styles.error}>{error}</Text>
        ) : (
          <View />
        )}
        {maxLength ? (
          <Text
            style={[
              styles.charCount,
              charCount >= maxLength && styles.charCountLimit,
            ]}
          >
            {charCount}/{maxLength}
          </Text>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  label: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
    marginBottom: spacing[1.5],
  },
  inputContainer: {
    borderRadius: radii.md,
    overflow: 'hidden',
  },
  input: {
    ...typography.bodyMd,
    color: colors.onSurface,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    minHeight: 120,
  },
  inputDisabled: {
    opacity: 0.5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing[1],
    paddingHorizontal: spacing[1],
  },
  error: {
    ...typography.bodySm,
    color: colors.error,
  },
  charCount: {
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
  },
  charCountLimit: {
    color: colors.error,
  },
});
