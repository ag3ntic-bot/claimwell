/**
 * New Claim Wizard — Step 4: Evidence Upload
 *
 * Users can add photos or documents to support their claim.
 * Includes a dashed upload area and list of added evidence items.
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

import { Button, Icon, CardSkeleton, ErrorState } from '@/components/ui';
import { ClaimProgress } from '@/components/common';
import { colors, spacing, typography, radii, shadows } from '@/theme';

type ScreenState = 'loading' | 'error' | 'ready';

interface EvidenceItem {
  id: string;
  name: string;
  type: 'photo' | 'document';
  size: string;
}

export default function NewClaimEvidenceScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [screenState, setScreenState] = useState<ScreenState>('ready');
  const [evidenceItems, setEvidenceItems] = useState<EvidenceItem[]>([]);

  const handleAddEvidence = useCallback(() => {
    // In production this would open the device file picker
    // For now, mock adding an evidence item
    const mockItems: EvidenceItem[] = [
      { id: `ev_${Date.now()}_1`, name: 'Purchase Receipt.pdf', type: 'document', size: '820 KB' },
      { id: `ev_${Date.now()}_2`, name: 'Product Photo.jpg', type: 'photo', size: '3.4 MB' },
      { id: `ev_${Date.now()}_3`, name: 'Support Chat.html', type: 'document', size: '245 KB' },
    ];

    const nextItem = mockItems[evidenceItems.length % mockItems.length];
    if (evidenceItems.length >= 3) {
      Alert.alert(
        'Maximum evidence',
        'You have reached the maximum number of evidence items for this demo.',
      );
      return;
    }
    setEvidenceItems((prev) => [...prev, { ...nextItem, id: `ev_${Date.now()}` }]);
  }, [evidenceItems]);

  const handleRemoveEvidence = useCallback((id: string) => {
    setEvidenceItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleNext = useCallback(() => {
    router.push('/new-claim/review');
  }, [router]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleSkip = useCallback(() => {
    router.push('/new-claim/review');
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
            <ClaimProgress currentStep={4} totalSteps={5} />
          </View>
          <CardSkeleton style={styles.skeletonCard} />
        </ScrollView>
      </View>
    );
  }

  if (screenState === 'error') {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <ErrorState
          title="Unable to load"
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
          <ClaimProgress currentStep={4} totalSteps={5} />
        </View>

        {/* Heading */}
        <Text style={styles.headline} accessibilityRole="header">
          Add your{'\n'}evidence
        </Text>
        <Text style={styles.description}>
          Upload receipts, photos, screenshots, or any documents that support
          your claim. Evidence strengthens your case significantly.
        </Text>

        {/* Upload Area */}
        <Pressable
          style={styles.uploadArea}
          onPress={handleAddEvidence}
          accessibilityRole="button"
          accessibilityLabel="Tap to add photos or documents as evidence"
        >
          <View style={styles.uploadIconCircle}>
            <Icon name="upload" size={32} color={colors.primary} />
          </View>
          <Text style={styles.uploadTitle}>Tap to add photos or documents</Text>
          <Text style={styles.uploadSubtitle}>
            Supports JPG, PNG, PDF, DOC up to 10MB each
          </Text>
        </Pressable>

        {/* Evidence List */}
        {evidenceItems.length > 0 && (
          <View style={styles.evidenceList}>
            <Text style={styles.evidenceListTitle}>
              Added Evidence ({evidenceItems.length})
            </Text>
            {evidenceItems.map((item) => (
              <View key={item.id} style={styles.evidenceItem}>
                <View style={styles.evidenceItemIconCircle}>
                  <Icon
                    name={item.type === 'photo' ? 'image' : 'description'}
                    size={20}
                    color={colors.primary}
                  />
                </View>
                <View style={styles.evidenceItemContent}>
                  <Text style={styles.evidenceItemName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.evidenceItemSize}>{item.size}</Text>
                </View>
                <Pressable
                  onPress={() => handleRemoveEvidence(item.id)}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  accessibilityRole="button"
                  accessibilityLabel={`Remove ${item.name}`}
                >
                  <Icon name="close" size={18} color={colors.onSurfaceVariant} />
                </Pressable>
              </View>
            ))}
          </View>
        )}

        {/* Empty hint */}
        {evidenceItems.length === 0 && (
          <View style={styles.emptyHint}>
            <Icon name="info" size={16} color={colors.onSurfaceVariant} />
            <Text style={styles.emptyHintText}>
              You can always add evidence later from the claim detail screen.
            </Text>
          </View>
        )}

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
            accessibilityLabel="Go back to details"
            style={styles.backButton}
          />
          <Button
            variant="primary"
            label="Next"
            icon="arrow_forward"
            onPress={handleNext}
            accessibilityLabel="Continue to review"
            style={styles.nextButton}
          />
        </View>
        <Pressable
          onPress={handleSkip}
          style={styles.skipLink}
          accessibilityRole="button"
          accessibilityLabel="Skip evidence upload for now"
        >
          <Text style={styles.skipLinkText}>Skip for now</Text>
        </Pressable>
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
  uploadArea: {
    borderRadius: radii.xl,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceContainerLow,
    paddingVertical: spacing[10],
    paddingHorizontal: spacing[6],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[5],
  },
  uploadIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[4],
  },
  uploadTitle: {
    ...typography.titleMd,
    color: colors.onSurface,
    marginBottom: spacing[1],
    textAlign: 'center',
  },
  uploadSubtitle: {
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
  evidenceList: {
    marginBottom: spacing[4],
  },
  evidenceListTitle: {
    ...typography.titleSm,
    color: colors.onSurfaceVariant,
    marginBottom: spacing[3],
  },
  evidenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radii.xl,
    padding: spacing[4],
    marginBottom: spacing[2],
    ...shadows.ambient,
  },
  evidenceItemIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },
  evidenceItemContent: {
    flex: 1,
  },
  evidenceItemName: {
    ...typography.titleSm,
    color: colors.onSurface,
  },
  evidenceItemSize: {
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
    marginTop: spacing[0.5],
  },
  emptyHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    paddingHorizontal: spacing[2],
  },
  emptyHintText: {
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
    flex: 1,
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
  skipLink: {
    alignSelf: 'center',
    paddingVertical: spacing[3],
  },
  skipLinkText: {
    ...typography.labelLg,
    color: colors.primary,
  },
  skeletonCard: {
    marginBottom: spacing[4],
  },
});
