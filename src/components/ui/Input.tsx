/**
 * Input component
 *
 * Text input following The Serene Advocate design:
 * Resting: surfaceContainerHighest bg, no border, md radius
 * Focus: white bg + 1pt ghost border primary at 40% opacity
 */

import React, { useCallback, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TextInput,
  View,
  TextInputProps,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { colors, radii, spacing, typography } from '@/theme';
import { Icon } from './Icon';

export interface InputProps {
  /** Optional floating label above the input */
  label?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Controlled value */
  value?: string;
  /** Change handler */
  onChangeText?: (text: string) => void;
  /** Error message (displays below input) */
  error?: string;
  /** Enable multiline */
  multiline?: boolean;
  /** Leading icon name */
  leftIcon?: string;
  /** Secure text entry (password) */
  secureTextEntry?: boolean;
  /** Disabled state */
  editable?: boolean;
  /** Keyboard type */
  keyboardType?: TextInputProps['keyboardType'];
  /** Auto capitalize */
  autoCapitalize?: TextInputProps['autoCapitalize'];
  /** Return key type */
  returnKeyType?: TextInputProps['returnKeyType'];
  /** Submit handler */
  onSubmitEditing?: () => void;
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Container style */
  style?: StyleProp<ViewStyle>;
  /** Max length */
  maxLength?: number;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  multiline = false,
  leftIcon,
  secureTextEntry,
  editable = true,
  keyboardType,
  autoCapitalize,
  returnKeyType,
  onSubmitEditing,
  accessibilityLabel,
  style,
  maxLength,
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
    outputRange: ['transparent', `${colors.primary}66`], // 40% opacity
  });

  const backgroundColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.surfaceContainerHighest, colors.surfaceContainerLowest],
  });

  const hasError = !!error;

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
          multiline && styles.multiline,
        ]}
      >
        {leftIcon ? (
          <Icon
            name={leftIcon}
            size={20}
            color={isFocused ? colors.primary : colors.onSurfaceVariant}
            style={styles.leftIcon}
          />
        ) : null}
        <TextInput
          style={[
            styles.input,
            leftIcon ? styles.inputWithIcon : null,
            multiline && styles.multilineInput,
            !editable && styles.inputDisabled,
          ]}
          placeholder={placeholder}
          placeholderTextColor={colors.onSurfaceVariant}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          multiline={multiline}
          secureTextEntry={secureTextEntry}
          editable={editable}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          maxLength={maxLength}
          accessibilityLabel={accessibilityLabel ?? label ?? placeholder}
          accessibilityRole="text"
          accessibilityState={{ disabled: !editable }}
          textAlignVertical={multiline ? 'top' : 'center'}
        />
      </Animated.View>
      {hasError ? (
        <Text style={styles.error}>{error}</Text>
      ) : null}
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
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.md,
    overflow: 'hidden',
  },
  multiline: {
    alignItems: 'flex-start',
  },
  leftIcon: {
    marginLeft: spacing[3],
  },
  input: {
    flex: 1,
    ...typography.bodyMd,
    color: colors.onSurface,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    minHeight: 48,
  },
  inputWithIcon: {
    paddingLeft: spacing[2],
  },
  multilineInput: {
    minHeight: 120,
    paddingTop: spacing[3],
  },
  inputDisabled: {
    opacity: 0.5,
  },
  error: {
    ...typography.bodySm,
    color: colors.error,
    marginTop: spacing[1],
    marginLeft: spacing[1],
  },
});
