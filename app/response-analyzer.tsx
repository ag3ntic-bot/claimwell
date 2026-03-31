/**
 * Response Analyzer Screen
 *
 * Standalone screen where users paste a company's response
 * and receive AI-powered analysis including sentiment,
 * resolution probability, and suggested strategy.
 */

import React, { useState, useCallback } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import {
  Badge,
  Button,
  Card,
  Icon,
  CardSkeleton,
  ErrorState,
  ProgressBar,
} from '@/components/ui';
import { ResponseInput, SentimentCard, AnalysisCard, StrategyPreview } from '@/components/analyzer';
import { SectionHeader } from '@/components/common';
import { colors, spacing, typography, radii, shadows } from '@/theme';

type ScreenState = 'loading' | 'error' | 'ready';

const MOCK_ANALYSIS = {
  sentiment: 'Dismissive',
  sentimentScore: 0.75,
  sentimentDescription:
    'The response uses deflective language and avoids directly addressing the core issue. Key phrases like "upon further review" and "we are unable to" signal a prepared denial template rather than genuine engagement.',
  analysisText:
    'The company response contains several red flags that indicate a formulaic denial rather than a genuine review of your case. The representative references "company policy" without citing specific terms, and contradicts their own earlier support agent who acknowledged the defect. This inconsistency is a significant leverage point for your appeal.',
  quotedText:
    'Upon further review, we have determined that the damage to your device is consistent with accidental impact and is therefore not covered under the standard warranty.',
  resolutionProbability: 82,
  strategyDraft:
    'Reference the contradiction between the support agent and denial letter to establish inconsistency in their own process.\nCite the Magnuson-Moss Warranty Act to shift the burden of proof to the company.\nRequest specific diagnostic data they claim supports accidental damage — they likely do not have it.\nSet a firm 14-day deadline for resolution before escalating to the FTC and state attorney general.',
};

export default function ResponseAnalyzerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [screenState, setScreenState] = useState<ScreenState>('ready');
  const [responseText, setResponseText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleAnalyze = useCallback(async () => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsAnalyzing(false);
    setShowResults(true);
  }, []);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleGenerateReply = useCallback(() => {
    router.push('/templates/');
  }, [router]);

  const handleViewFullTemplate = useCallback(() => {
    router.push('/templates/');
  }, [router]);

  const handleRetry = useCallback(() => {
    setScreenState('loading');
    setTimeout(() => setScreenState('ready'), 600);
  }, []);

  const handleReset = useCallback(() => {
    setResponseText('');
    setShowResults(false);
  }, []);

  if (screenState === 'loading') {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerArea}>
            <CardSkeleton />
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
          title="Analyzer unavailable"
          description="The response analyzer is temporarily unavailable. Please try again."
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
        {/* Back Button */}
        <Pressable
          onPress={handleBack}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Icon name="arrow_back" size={24} color={colors.onSurface} />
        </Pressable>

        {/* Header Badge */}
        <Badge
          label="Next Best Action: Escalate"
          variant="primary"
          icon="trending_up"
          style={styles.headerBadge}
        />

        {/* Title */}
        <Text style={styles.headline} accessibilityRole="header">
          Response{'\n'}Analyzer
        </Text>
        <Text style={styles.description}>
          Paste the company's reply below and our AI will analyze their
          tone, identify weaknesses, and suggest your next move.
        </Text>

        {/* Response Input */}
        {!showResults && (
          <View style={styles.inputSection}>
            <ResponseInput
              value={responseText}
              onChangeText={setResponseText}
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
            />
          </View>
        )}

        {/* Analysis Results */}
        {showResults && (
          <View style={styles.resultsSection}>
            {/* Bento Grid Row 1 */}
            <View style={styles.bentoRow}>
              {/* Main Analysis Card */}
              <View style={styles.bentoMainCard}>
                <AnalysisCard
                  analysis={MOCK_ANALYSIS.analysisText}
                  quotedText={MOCK_ANALYSIS.quotedText}
                  onGenerateReply={handleGenerateReply}
                  onRecommendEscalation={() => {}}
                />
              </View>
            </View>

            {/* Bento Grid Row 2 */}
            <View style={styles.bentoRow2}>
              {/* Sentiment Card */}
              <View style={styles.bentoHalfCard}>
                <SentimentCard
                  sentiment={MOCK_ANALYSIS.sentiment}
                  score={MOCK_ANALYSIS.sentimentScore}
                  description={MOCK_ANALYSIS.sentimentDescription}
                />
              </View>

              {/* Resolution Probability */}
              <View style={styles.bentoHalfCard}>
                <Card
                  style={styles.probabilityCard}
                  accessibilityLabel={`Resolution probability: ${MOCK_ANALYSIS.resolutionProbability}%`}
                >
                  <Text style={styles.probabilityLabel}>Resolution{'\n'}Probability</Text>
                  <Text style={styles.probabilityValue}>
                    {MOCK_ANALYSIS.resolutionProbability}%
                  </Text>
                  <ProgressBar
                    progress={MOCK_ANALYSIS.resolutionProbability / 100}
                    variant="primary"
                    height={6}
                  />
                </Card>
              </View>
            </View>

            {/* Strategy Preview */}
            <View style={styles.strategySection}>
              <SectionHeader title="Suggested Strategy" />
              <View style={styles.strategyCard}>
                <StrategyPreview
                  draft={MOCK_ANALYSIS.strategyDraft}
                  onViewFullTemplate={handleViewFullTemplate}
                />
              </View>
            </View>

            {/* Reset */}
            <View style={styles.resetSection}>
              <Button
                variant="secondary"
                label="Analyze Another Response"
                icon="refresh"
                onPress={handleReset}
                fullWidth
                accessibilityLabel="Reset and analyze another response"
              />
            </View>
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
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
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing[2],
    marginLeft: -spacing[2],
  },
  headerArea: {
    paddingTop: spacing[6],
  },
  headerBadge: {
    marginTop: spacing[2],
    marginBottom: spacing[4],
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
  inputSection: {
    marginBottom: spacing[6],
  },
  resultsSection: {
    gap: spacing[4],
  },
  bentoRow: {
    marginBottom: spacing[0],
  },
  bentoMainCard: {
    width: '100%',
  },
  bentoRow2: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  bentoHalfCard: {
    flex: 1,
  },
  probabilityCard: {
    backgroundColor: colors.primary,
    flex: 1,
  },
  probabilityLabel: {
    ...typography.labelMd,
    color: colors.onPrimary,
    marginBottom: spacing[3],
  },
  probabilityValue: {
    ...typography.displayMd,
    color: colors.onPrimary,
    marginBottom: spacing[4],
  },
  strategySection: {
    marginTop: spacing[2],
  },
  strategyCard: {
    marginTop: spacing[2],
  },
  resetSection: {
    marginTop: spacing[2],
  },
  bottomSpacer: {
    height: spacing[12],
  },
  skeletonCard: {
    marginTop: spacing[4],
  },
});
