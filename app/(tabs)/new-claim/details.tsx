/**
 * New Claim Wizard — Step 3: Details
 *
 * Users provide claim description, amount, and date of incident.
 * Validated with Zod via the useClaimForm hook.
 */

import React, { useState, useCallback } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { Button, Input, TextArea, CardSkeleton, ErrorState } from '@/components/ui';
import { ClaimProgress } from '@/components/common';
import { colors, spacing, typography } from '@/theme';
import { useClaimForm } from '@/hooks';

type ScreenState = 'loading' | 'error' | 'ready';

export default function NewClaimDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { form } = useClaimForm();
  const [screenState, setScreenState] = useState<ScreenState>('ready');

  const [description, setDescription] = useState(form.getValues('description') || '');
  const [amount, setAmount] = useState(
    form.getValues('amountClaimed') > 0
      ? String(form.getValues('amountClaimed'))
      : '',
  );
  const [dateOfIncident, setDateOfIncident] = useState('');
  const [errors, setErrors] = useState<{
    description?: string;
    amount?: string;
  }>({});

  const validate = useCallback((): boolean => {
    const newErrors: typeof errors = {};

    if (description.trim().length < 20) {
      newErrors.description = 'Description must be at least 20 characters.';
    }

    const parsedAmount = parseFloat(amount);
    if (!amount.trim() || isNaN(parsedAmount) || parsedAmount <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than zero.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [description, amount]);

  const handleNext = useCallback(() => {
    if (!validate()) return;

    form.setValue('description', description.trim());
    form.setValue('amountClaimed', parseFloat(amount));
    router.push('/new-claim/evidence');
  }, [validate, description, amount, form, router]);

  const handleBack = useCallback(() => {
    // Persist current state before going back
    if (description.trim()) {
      form.setValue('description', description.trim());
    }
    if (amount.trim() && !isNaN(parseFloat(amount))) {
      form.setValue('amountClaimed', parseFloat(amount));
    }
    router.back();
  }, [description, amount, form, router]);

  const handleRetry = useCallback(() => {
    setScreenState('loading');
    setTimeout(() => setScreenState('ready'), 600);
  }, []);

  if (screenState === 'loading') {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.progressContainer}>
            <ClaimProgress currentStep={3} totalSteps={5} />
          </View>
          <CardSkeleton style={styles.skeletonCard} />
          <CardSkeleton style={styles.skeletonCard} />
        </ScrollView>
      </View>
    );
  }

  if (screenState === 'error') {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <ErrorState
          title="Unable to load form"
          description="Something went wrong. Please try again."
          onRetry={handleRetry}
        />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Progress */}
        <View style={styles.progressContainer}>
          <ClaimProgress currentStep={3} totalSteps={5} />
        </View>

        {/* Heading */}
        <Text style={styles.headline} accessibilityRole="header">
          Tell us what{'\n'}happened
        </Text>
        <Text style={styles.description}>
          Provide the details of your claim. The more specific you are, the
          stronger your case will be.
        </Text>

        {/* Description */}
        <View style={styles.fieldContainer}>
          <TextArea
            label="Description"
            placeholder="Describe the issue in detail. Include dates, what happened, what you expected, and any steps you have already taken..."
            value={description}
            onChangeText={(text) => {
              setDescription(text);
              if (errors.description) {
                setErrors((prev) => ({ ...prev, description: undefined }));
              }
            }}
            maxLength={2000}
            error={errors.description}
            accessibilityLabel="Claim description"
          />
        </View>

        {/* Amount Claimed */}
        <View style={styles.fieldContainer}>
          <Input
            label="Amount Claimed"
            placeholder="0.00"
            value={amount}
            onChangeText={(text) => {
              // Allow only numeric input with decimal
              const cleaned = text.replace(/[^0-9.]/g, '');
              setAmount(cleaned);
              if (errors.amount) {
                setErrors((prev) => ({ ...prev, amount: undefined }));
              }
            }}
            leftIcon="attach_money"
            keyboardType="decimal-pad"
            error={errors.amount}
            accessibilityLabel="Amount claimed in dollars"
          />
        </View>

        {/* Date of Incident */}
        <View style={styles.fieldContainer}>
          <Input
            label="Date of Incident (optional)"
            placeholder="MM/DD/YYYY"
            value={dateOfIncident}
            onChangeText={setDateOfIncident}
            leftIcon="calendar_today"
            keyboardType="numbers-and-punctuation"
            accessibilityLabel="Date of incident"
          />
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Fixed Footer */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing[4]) }]}>
        <View style={styles.footerGradient} />
        <View style={styles.footerButtons}>
          <Button
            variant="secondary"
            label="Back"
            icon="arrow_back"
            onPress={handleBack}
            accessibilityLabel="Go back to company selection"
            style={styles.backButton}
          />
          <Button
            variant="primary"
            label="Next"
            icon="arrow_forward"
            onPress={handleNext}
            disabled={!description.trim() || !amount.trim()}
            accessibilityLabel="Continue to evidence upload"
            style={styles.nextButton}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing[5],
  },
  progressContainer: {
    paddingTop: spacing[4],
    paddingBottom: spacing[6],
  },
  headline: {
    ...typography.displaySm,
    fontWeight: '800',
    color: colors.onSurface,
    marginBottom: spacing[3],
  },
  description: {
    ...typography.bodyLg,
    color: colors.onSurfaceVariant,
    marginBottom: spacing[6],
    lineHeight: 26,
  },
  fieldContainer: {
    marginBottom: spacing[5],
  },
  bottomSpacer: {
    height: 120,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing[5],
    paddingTop: spacing[4],
  },
  footerGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.surface,
    opacity: 0.95,
  },
  footerButtons: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  backButton: {
    flex: 1,
  },
  nextButton: {
    flex: 2,
  },
  skeletonCard: {
    marginBottom: spacing[4],
  },
});
