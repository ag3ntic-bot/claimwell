/**
 * New Claim Wizard — Step 5: Review & Submit
 *
 * Users review all claim details before submitting.
 * Each section is tappable to navigate back to the relevant step.
 */

import React, { useState, useCallback } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { Button, Card, Icon, CardSkeleton, ErrorState } from '@/components/ui';
import { ClaimProgress } from '@/components/common';
import { colors, spacing, typography, radii, shadows } from '@/theme';
import { CLAIM_CATEGORY_META } from '@/types';
import { useClaimForm } from '@/hooks';
import { formatCurrency } from '@/utils';

type ScreenState = 'loading' | 'error' | 'ready';

export default function NewClaimReviewScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { form, reset } = useClaimForm();
  const [screenState, setScreenState] = useState<ScreenState>('ready');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const category = form.getValues('category');
  const companyName = form.getValues('companyName');
  const description = form.getValues('description');
  const amountClaimed = form.getValues('amountClaimed');
  const categoryMeta = CLAIM_CATEGORY_META[category];

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);

    reset();

    Alert.alert(
      'Claim Submitted',
      'Your claim has been submitted successfully. You can track its progress from your dashboard.',
      [
        {
          text: 'Go to Dashboard',
          onPress: () => router.replace('/'),
        },
      ],
    );
  }, [reset, router]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleEditCategory = useCallback(() => {
    router.push('/(tabs)/new-claim/' as never);
  }, [router]);

  const handleEditCompany = useCallback(() => {
    router.push('/new-claim/company');
  }, [router]);

  const handleEditDetails = useCallback(() => {
    router.push('/new-claim/details');
  }, [router]);

  const handleEditEvidence = useCallback(() => {
    router.push('/new-claim/evidence');
  }, [router]);

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
            <ClaimProgress currentStep={5} totalSteps={5} />
          </View>
          <CardSkeleton style={styles.skeletonCard} />
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
          title="Unable to load review"
          description="Something went wrong. Please try again."
          onRetry={handleRetry}
        />
      </View>
    );
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress */}
        <View style={styles.progressContainer}>
          <ClaimProgress currentStep={5} totalSteps={5} />
        </View>

        {/* Heading */}
        <Text style={styles.headline} accessibilityRole="header">
          Review your{'\n'}claim
        </Text>
        <Text style={styles.description}>
          Please verify all the details below are correct before submitting.
          Tap any section to make changes.
        </Text>

        {/* Category Section */}
        <Pressable
          onPress={handleEditCategory}
          accessibilityRole="button"
          accessibilityLabel={`Edit category: ${categoryMeta.label}`}
        >
          <Card style={styles.reviewCard}>
            <View style={styles.reviewCardHeader}>
              <View style={styles.reviewCardLabelRow}>
                <Icon name={categoryMeta.icon} size={18} color={colors.primary} />
                <Text style={styles.reviewCardLabel}>Category</Text>
              </View>
              <Icon name="edit" size={16} color={colors.onSurfaceVariant} />
            </View>
            <Text style={styles.reviewCardValue}>{categoryMeta.label}</Text>
          </Card>
        </Pressable>

        {/* Company Section */}
        <Pressable
          onPress={handleEditCompany}
          accessibilityRole="button"
          accessibilityLabel={`Edit company: ${companyName}`}
        >
          <Card style={styles.reviewCard}>
            <View style={styles.reviewCardHeader}>
              <View style={styles.reviewCardLabelRow}>
                <Icon name="person" size={18} color={colors.primary} />
                <Text style={styles.reviewCardLabel}>Company</Text>
              </View>
              <Icon name="edit" size={16} color={colors.onSurfaceVariant} />
            </View>
            <Text style={styles.reviewCardValue}>
              {companyName || 'Not specified'}
            </Text>
          </Card>
        </Pressable>

        {/* Description Section */}
        <Pressable
          onPress={handleEditDetails}
          accessibilityRole="button"
          accessibilityLabel="Edit claim description"
        >
          <Card style={styles.reviewCard}>
            <View style={styles.reviewCardHeader}>
              <View style={styles.reviewCardLabelRow}>
                <Icon name="description" size={18} color={colors.primary} />
                <Text style={styles.reviewCardLabel}>Description</Text>
              </View>
              <Icon name="edit" size={16} color={colors.onSurfaceVariant} />
            </View>
            <Text style={styles.reviewCardDescription} numberOfLines={4}>
              {description || 'No description provided'}
            </Text>
          </Card>
        </Pressable>

        {/* Amount Section */}
        <Pressable
          onPress={handleEditDetails}
          accessibilityRole="button"
          accessibilityLabel={`Edit amount: ${formatCurrency(amountClaimed)}`}
        >
          <Card style={styles.reviewCard}>
            <View style={styles.reviewCardHeader}>
              <View style={styles.reviewCardLabelRow}>
                <Icon name="attach_money" size={18} color={colors.primary} />
                <Text style={styles.reviewCardLabel}>Amount Claimed</Text>
              </View>
              <Icon name="edit" size={16} color={colors.onSurfaceVariant} />
            </View>
            <Text style={styles.reviewCardAmount}>
              {amountClaimed > 0 ? formatCurrency(amountClaimed) : 'Not specified'}
            </Text>
          </Card>
        </Pressable>

        {/* Evidence Section */}
        <Pressable
          onPress={handleEditEvidence}
          accessibilityRole="button"
          accessibilityLabel="Edit evidence"
        >
          <Card style={styles.reviewCard}>
            <View style={styles.reviewCardHeader}>
              <View style={styles.reviewCardLabelRow}>
                <Icon name="attachment" size={18} color={colors.primary} />
                <Text style={styles.reviewCardLabel}>Evidence</Text>
              </View>
              <Icon name="edit" size={16} color={colors.onSurfaceVariant} />
            </View>
            <Text style={styles.reviewCardValue}>
              0 files attached
            </Text>
            <Text style={styles.reviewCardHint}>
              You can add evidence after submission too.
            </Text>
          </Card>
        </Pressable>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Fixed Footer */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing[4]) }]}>
        <View style={styles.footerGradient} />
        <Button
          variant="primary"
          label="Submit Claim"
          icon="check"
          onPress={handleSubmit}
          loading={isSubmitting}
          disabled={!companyName || !description || amountClaimed <= 0}
          fullWidth
          accessibilityLabel="Submit your claim"
        />
        <View style={styles.footerBackRow}>
          <Button
            variant="tertiary"
            label="Back"
            icon="arrow_back"
            onPress={handleBack}
            accessibilityLabel="Go back to evidence"
          />
        </View>
      </View>
    </View>
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
  reviewCard: {
    marginBottom: spacing[3],
  },
  reviewCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing[2],
  },
  reviewCardLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  reviewCardLabel: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
  },
  reviewCardValue: {
    ...typography.titleMd,
    color: colors.onSurface,
  },
  reviewCardDescription: {
    ...typography.bodyMd,
    color: colors.onSurface,
    lineHeight: 22,
  },
  reviewCardAmount: {
    ...typography.headlineMd,
    color: colors.primary,
  },
  reviewCardHint: {
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
    marginTop: spacing[1],
  },
  bottomSpacer: {
    height: 160,
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
  footerBackRow: {
    alignItems: 'center',
    marginTop: spacing[1],
  },
  skeletonCard: {
    marginBottom: spacing[4],
  },
});
