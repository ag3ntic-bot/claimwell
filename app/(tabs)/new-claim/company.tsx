/**
 * New Claim Wizard — Step 2: Company
 *
 * Users identify the company they are filing a claim against.
 * Includes a search input with autocomplete-style suggestions.
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

import { Button, Card, Icon, Input, CardSkeleton, ErrorState } from '@/components/ui';
import { ClaimProgress } from '@/components/common';
import { colors, spacing, typography, radii, shadows } from '@/theme';
import { useClaimForm } from '@/hooks';

type ScreenState = 'loading' | 'error' | 'ready';

const POPULAR_COMPANIES = [
  { name: 'Apple Inc.', icon: 'phone' },
  { name: 'Amazon', icon: 'local_shipping' },
  { name: 'Adobe Systems', icon: 'description' },
  { name: 'Sony Electronics', icon: 'settings' },
  { name: 'United Airlines', icon: 'place' },
  { name: 'Equinox', icon: 'star' },
  { name: 'Samsung Electronics', icon: 'phone' },
  { name: 'Microsoft', icon: 'description' },
  { name: 'AT&T', icon: 'phone' },
  { name: 'Verizon', icon: 'phone' },
];

export default function NewClaimCompanyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { form } = useClaimForm();
  const [screenState, setScreenState] = useState<ScreenState>('ready');
  const [searchQuery, setSearchQuery] = useState(form.getValues('companyName') || '');
  const [selectedCompany, setSelectedCompany] = useState<string | null>(
    form.getValues('companyName') || null,
  );

  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return POPULAR_COMPANIES.filter((c) =>
      c.name.toLowerCase().includes(q),
    ).slice(0, 5);
  }, [searchQuery]);

  const showSuggestions = searchQuery.trim().length > 0 && !selectedCompany;

  const handleSelectCompany = useCallback(
    (name: string) => {
      setSelectedCompany(name);
      setSearchQuery(name);
      form.setValue('companyName', name);
    },
    [form],
  );

  const handleClearSelection = useCallback(() => {
    setSelectedCompany(null);
    setSearchQuery('');
    form.setValue('companyName', '');
  }, [form]);

  const handleSearchChange = useCallback(
    (text: string) => {
      setSearchQuery(text);
      if (selectedCompany) {
        setSelectedCompany(null);
      }
    },
    [selectedCompany],
  );

  const handleNext = useCallback(() => {
    if (!selectedCompany && !searchQuery.trim()) return;
    const company = selectedCompany || searchQuery.trim();
    form.setValue('companyName', company);
    router.push('/new-claim/details');
  }, [selectedCompany, searchQuery, form, router]);

  const handleBack = useCallback(() => {
    router.back();
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
            <ClaimProgress currentStep={2} totalSteps={5} />
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
          title="Unable to load company data"
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
        keyboardShouldPersistTaps="handled"
      >
        {/* Progress */}
        <View style={styles.progressContainer}>
          <ClaimProgress currentStep={2} totalSteps={5} />
        </View>

        {/* Heading */}
        <Text style={styles.headline} accessibilityRole="header">
          Who is the claim{'\n'}against?
        </Text>
        <Text style={styles.description}>
          Enter the company or organization you are filing this claim with.
          We will use this to tailor your communications.
        </Text>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <Input
            label="Company Name"
            placeholder="Search for a company..."
            value={searchQuery}
            onChangeText={handleSearchChange}
            leftIcon="search"
            returnKeyType="search"
            autoCapitalize="words"
            accessibilityLabel="Company name search"
          />
        </View>

        {/* Autocomplete Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            {suggestions.map((company) => (
              <Pressable
                key={company.name}
                style={styles.suggestionItem}
                onPress={() => handleSelectCompany(company.name)}
                accessibilityRole="button"
                accessibilityLabel={`Select ${company.name}`}
              >
                <View style={styles.suggestionIconCircle}>
                  <Icon name={company.icon} size={18} color={colors.primary} />
                </View>
                <Text style={styles.suggestionText}>{company.name}</Text>
                <Icon name="chevron_right" size={16} color={colors.onSurfaceVariant} />
              </Pressable>
            ))}
          </View>
        )}

        {/* Selected Company Display */}
        {selectedCompany && (
          <Card style={styles.selectedCard} accessibilityLabel={`Selected company: ${selectedCompany}`}>
            <View style={styles.selectedCardContent}>
              <View style={styles.selectedIconCircle}>
                <Icon name="verified" size={24} color={colors.primary} />
              </View>
              <View style={styles.selectedTextContainer}>
                <Text style={styles.selectedCompanyName}>{selectedCompany}</Text>
                <Text style={styles.selectedLabel}>Selected company</Text>
              </View>
              <Pressable
                onPress={handleClearSelection}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                accessibilityRole="button"
                accessibilityLabel="Clear company selection"
              >
                <Icon name="close" size={20} color={colors.onSurfaceVariant} />
              </Pressable>
            </View>
          </Card>
        )}

        {/* Popular Companies */}
        {!selectedCompany && !searchQuery.trim() && (
          <View style={styles.popularSection}>
            <Text style={styles.popularHeading}>Popular Companies</Text>
            <View style={styles.popularGrid}>
              {POPULAR_COMPANIES.slice(0, 6).map((company) => (
                <Pressable
                  key={company.name}
                  style={styles.popularChip}
                  onPress={() => handleSelectCompany(company.name)}
                  accessibilityRole="button"
                  accessibilityLabel={`Select ${company.name}`}
                >
                  <Icon name={company.icon} size={16} color={colors.primary} />
                  <Text style={styles.popularChipText}>{company.name}</Text>
                </Pressable>
              ))}
            </View>
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
            accessibilityLabel="Go back to category selection"
            style={styles.backButton}
          />
          <Button
            variant="primary"
            label="Next"
            icon="arrow_forward"
            onPress={handleNext}
            disabled={!selectedCompany && !searchQuery.trim()}
            accessibilityLabel="Continue to claim details"
            style={styles.nextButton}
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
  searchContainer: {
    marginBottom: spacing[3],
  },
  suggestionsContainer: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radii.xl,
    ...shadows.ambient,
    overflow: 'hidden',
    marginBottom: spacing[4],
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
  },
  suggestionIconCircle: {
    width: 36,
    height: 36,
    borderRadius: radii.full,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },
  suggestionText: {
    ...typography.bodyMd,
    color: colors.onSurface,
    flex: 1,
  },
  selectedCard: {
    marginBottom: spacing[4],
  },
  selectedCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedIconCircle: {
    width: 48,
    height: 48,
    borderRadius: radii.full,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },
  selectedTextContainer: {
    flex: 1,
  },
  selectedCompanyName: {
    ...typography.titleMd,
    color: colors.onSurface,
  },
  selectedLabel: {
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
    marginTop: spacing[0.5],
  },
  popularSection: {
    marginTop: spacing[4],
  },
  popularHeading: {
    ...typography.titleSm,
    color: colors.onSurfaceVariant,
    marginBottom: spacing[3],
  },
  popularGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  popularChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radii.full,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    gap: spacing[1.5],
  },
  popularChipText: {
    ...typography.labelMd,
    color: colors.onSurface,
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
