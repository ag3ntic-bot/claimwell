/**
 * New Claim Wizard — Step 1: Category
 *
 * Users choose the type of claim they want to file.
 * Displays a search input and a 2-column grid of category cards.
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { Button, Icon, Input, CardSkeleton, ErrorState } from '@/components/ui';
import { ClaimProgress } from '@/components/common';
import { colors, spacing, typography, radii, shadows } from '@/theme';
import { CLAIM_CATEGORY_META } from '@/types';
import type { ClaimCategory } from '@/types';
import { useClaimForm } from '@/hooks';

type ScreenState = 'loading' | 'error' | 'ready';

const CATEGORY_BG: Record<ClaimCategory, string> = {
  refund: colors.primaryContainer,
  warranty: colors.tertiaryContainer,
  subscription: colors.surfaceContainerHigh,
  delivery: colors.secondaryContainer,
  other: colors.surfaceVariant,
};

const CATEGORY_ICON_BG: Record<ClaimCategory, string> = {
  refund: `${colors.primary}22`,
  warranty: `${colors.tertiary}22`,
  subscription: `${colors.onSurfaceVariant}18`,
  delivery: `${colors.secondary}22`,
  other: `${colors.onSurfaceVariant}18`,
};

const CATEGORY_ICON_COLOR: Record<ClaimCategory, string> = {
  refund: colors.primary,
  warranty: colors.tertiary,
  subscription: colors.onSurfaceVariant,
  delivery: colors.secondary,
  other: colors.onSurfaceVariant,
};

const CATEGORY_ORDER: ClaimCategory[] = [
  'refund',
  'warranty',
  'subscription',
  'delivery',
  'other',
];

export default function NewClaimCategoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { form } = useClaimForm();
  const [screenState, setScreenState] = useState<ScreenState>('ready');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ClaimCategory | null>(
    form.getValues('category') !== 'other' ? form.getValues('category') : null,
  );

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return CATEGORY_ORDER;
    const q = searchQuery.toLowerCase();
    return CATEGORY_ORDER.filter(
      (key) =>
        CLAIM_CATEGORY_META[key].label.toLowerCase().includes(q) ||
        CLAIM_CATEGORY_META[key].description.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  const handleSelectCategory = useCallback(
    (category: ClaimCategory) => {
      setSelectedCategory(category);
      form.setValue('category', category);
    },
    [form],
  );

  const handleNext = useCallback(() => {
    if (!selectedCategory) return;
    form.setValue('category', selectedCategory);
    router.push('/new-claim/company');
  }, [selectedCategory, form, router]);

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
            <ClaimProgress currentStep={1} totalSteps={5} />
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
          title="Unable to load categories"
          description="Something went wrong loading the claim categories. Please try again."
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
        keyboardShouldPersistTaps="handled"
      >
        {/* Progress */}
        <View style={styles.progressContainer}>
          <ClaimProgress currentStep={1} totalSteps={5} />
        </View>

        {/* Heading */}
        <Text style={styles.headline} accessibilityRole="header">
          What are we{'\n'}claiming?
        </Text>
        <Text style={styles.description}>
          Select the category that best describes your claim. This helps us
          tailor the process and suggest the right templates.
        </Text>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Input
            placeholder="Search company name (e.g., Amazon, United Airlines)"
            value={searchQuery}
            onChangeText={setSearchQuery}
            leftIcon="search"
            returnKeyType="search"
            autoCapitalize="none"
            accessibilityLabel="Search claim categories"
          />
        </View>

        {/* Category Grid */}
        <View style={styles.grid}>
          {filteredCategories.map((key, _index) => {
            const meta = CLAIM_CATEGORY_META[key];
            const isSelected = selectedCategory === key;
            const isOther = key === 'other';
            const isLastRow = isOther;

            return (
              <Pressable
                key={key}
                style={[
                  styles.categoryCard,
                  { backgroundColor: CATEGORY_BG[key] },
                  isLastRow && styles.categoryCardFullWidth,
                  isSelected && styles.categoryCardSelected,
                ]}
                onPress={() => handleSelectCategory(key)}
                accessibilityRole="button"
                accessibilityLabel={`${meta.label}: ${meta.description}`}
                accessibilityState={{ selected: isSelected }}
              >
                <View
                  style={[
                    styles.categoryIconCircle,
                    { backgroundColor: CATEGORY_ICON_BG[key] },
                  ]}
                >
                  <Icon
                    name={meta.icon}
                    size={24}
                    color={CATEGORY_ICON_COLOR[key]}
                  />
                </View>
                <Text style={styles.categoryTitle}>{meta.label}</Text>
                <Text style={styles.categoryDescription} numberOfLines={2}>
                  {meta.description}
                </Text>
                {isOther && (
                  <View style={styles.chevronRow}>
                    <Icon
                      name="chevron_right"
                      size={20}
                      color={colors.onSurfaceVariant}
                    />
                  </View>
                )}
                {isSelected && (
                  <View style={styles.selectedIndicator}>
                    <Icon name="check_circle" size={20} color={colors.primary} />
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>

        {filteredCategories.length === 0 && (
          <View style={styles.emptySearch}>
            <Text style={styles.emptySearchText}>
              No categories match your search. Try a different term.
            </Text>
          </View>
        )}

        {/* Bottom spacing for fixed footer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Fixed Footer */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing[4]) }]}>
        <View style={styles.footerGradient} />
        <Button
          variant="primary"
          label="Next"
          icon="arrow_forward"
          onPress={handleNext}
          disabled={!selectedCategory}
          fullWidth
          accessibilityLabel="Continue to next step"
        />
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
  searchContainer: {
    marginBottom: spacing[6],
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
  },
  categoryCard: {
    width: '48%',
    borderRadius: radii.xl,
    padding: spacing[5],
    ...shadows.ambient,
    position: 'relative',
    overflow: 'hidden',
  },
  categoryCardFullWidth: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[4],
  },
  categoryCardSelected: {
    ...shadows.hover,
  },
  categoryIconCircle: {
    width: 48,
    height: 48,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[3],
  },
  categoryTitle: {
    ...typography.titleMd,
    color: colors.onSurface,
    marginBottom: spacing[1],
  },
  categoryDescription: {
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
    lineHeight: 18,
  },
  chevronRow: {
    position: 'absolute',
    right: spacing[4],
    top: '50%',
    marginTop: -10,
  },
  selectedIndicator: {
    position: 'absolute',
    top: spacing[3],
    right: spacing[3],
  },
  emptySearch: {
    paddingVertical: spacing[10],
    alignItems: 'center',
  },
  emptySearchText: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
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
  skeletonCard: {
    marginBottom: spacing[4],
  },
});
