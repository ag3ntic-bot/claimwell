/**
 * Sign In Screen
 *
 * Email/password sign-in form with mock login for dev mode.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, spacing } from '@/theme';
import { Input, Button } from '@/components/ui';
import { useAuth } from '@/hooks';

export default function SignInScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing fields', 'Please enter your email and password.');
      return;
    }

    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch {
      Alert.alert(
        'Sign in failed',
        'Please check your credentials and try again.',
      );
    }
  };

  const handleGoToSignUp = () => {
    router.push('/(auth)/sign-up');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + spacing[16],
            paddingBottom: insets.bottom + spacing[6],
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={styles.heading}>Welcome back</Text>
        <Text style={styles.description}>
          Sign in to access your claims, documents, and personalized strategies.
        </Text>

        {/* Form */}
        <View style={styles.form}>
          <Input
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="next"
            leftIcon="email"
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            returnKeyType="done"
            onSubmitEditing={handleSignIn}
            leftIcon="lock"
            style={styles.passwordInput}
          />
        </View>

        {/* Sign In Button */}
        <View style={styles.buttonContainer}>
          <Button
            label="Sign In"
            onPress={handleSignIn}
            loading={isLoading}
            fullWidth
          />
        </View>

        {/* Sign up link */}
        <View style={styles.linkRow}>
          <Text style={styles.linkText}>Don't have an account? </Text>
          <Pressable onPress={handleGoToSignUp} hitSlop={8}>
            <Text style={styles.linkAction}>Sign Up</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing[6],
  },
  heading: {
    ...typography.headlineLg,
    fontFamily: 'Manrope-Bold',
    color: colors.onSurface,
    marginBottom: spacing[2],
  },
  description: {
    ...typography.bodyMd,
    fontFamily: 'Inter',
    color: colors.onSurfaceVariant,
    marginBottom: spacing[8],
    lineHeight: 22,
  },
  form: {
    gap: spacing[4],
    marginBottom: spacing[8],
  },
  passwordInput: {
    marginTop: spacing[1],
  },
  buttonContainer: {
    marginBottom: spacing[6],
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkText: {
    ...typography.bodyMd,
    fontFamily: 'Inter',
    color: colors.onSurfaceVariant,
  },
  linkAction: {
    ...typography.bodyMd,
    fontFamily: 'Inter-SemiBold',
    color: colors.primary,
    fontWeight: '600',
  },
});
