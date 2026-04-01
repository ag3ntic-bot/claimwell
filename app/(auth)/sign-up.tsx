/**
 * Sign Up Screen
 *
 * Account creation form with name, email, and password fields.
 * Mock sign-up that auto-succeeds in dev mode.
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
import { useAuthStore } from '@/stores';

export default function SignUpScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const setUser = useAuthStore((s) => s.setUser);
  const setToken = useAuthStore((s) => s.setToken);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Missing fields', 'Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Weak password', 'Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      // Mock sign-up: auto-succeed in dev mode
      if (__DEV__) {
        await setToken('mock-dev-token');
        setUser({
          id: 'user-1',
          email,
          name,
          avatarUri: null,
          subscriptionTier: 'free',
          createdAt: new Date().toISOString(),
        });
        router.replace('/(tabs)');
        return;
      }

      // Production sign-up would call the API here
      Alert.alert('Success', 'Account created successfully!');
      router.replace('/(tabs)');
    } catch {
      Alert.alert(
        'Sign up failed',
        'Something went wrong. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToSignIn = () => {
    router.push('/(auth)/sign-in');
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
        <Text style={styles.heading}>Create account</Text>
        <Text style={styles.description}>
          Join Claimwell to start analyzing your insurance documents and
          recovering what you're owed.
        </Text>

        {/* Form */}
        <View style={styles.form}>
          <Input
            label="Full Name"
            placeholder="John Doe"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            returnKeyType="next"
            leftIcon="person"
          />

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
            placeholder="At least 6 characters"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            returnKeyType="done"
            onSubmitEditing={handleSignUp}
            leftIcon="lock"
          />
        </View>

        {/* Sign Up Button */}
        <View style={styles.buttonContainer}>
          <Button
            label="Create Account"
            onPress={handleSignUp}
            loading={isLoading}
            fullWidth
          />
        </View>

        {/* Sign in link */}
        <View style={styles.linkRow}>
          <Text style={styles.linkText}>Already have an account? </Text>
          <Pressable onPress={handleGoToSignIn} hitSlop={8}>
            <Text style={styles.linkAction}>Sign In</Text>
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
