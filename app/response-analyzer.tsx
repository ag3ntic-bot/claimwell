/**
 * Response Analyzer Screen
 *
 * Standalone screen where users paste a company's response
 * and receive AI-powered analysis including sentiment,
 * resolution probability, and suggested strategy.
 */

import React, { useState, useCallback } from 'react';
import {
  Alert,
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
  ProgressBar,
} from '@/components/ui';
import { ResponseInput, SentimentCard, AnalysisCard, StrategyPreview } from '@/components/analyzer';
import { SectionHeader } from '@/components/common';
import { colors, spacing, typography } from '@/theme';
import { useAnalyzeResponse } from '@/hooks/mutations/useAnalyzeResponse';

interface AnalysisResult {
  sentiment: string;
  sentimentScore: number;
  sentimentDescription: string;
  analysisText: string;
  quotedText: string;
  resolutionProbability: number;
  strategyDraft: string;
}

export default function ResponseAnalyzerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [responseText, setResponseText] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const analyzeResponse = useAnalyzeResponse();

  const showResults = analysis !== null;

  const handleAnalyze = useCallback(async () => {
    try {
      const result = await analyzeResponse.mutateAsync({
        responseText,
        claimContext: {},
      });
      setAnalysis({
        sentiment: result.sentiment ?? 'Unknown',
        sentimentScore: Math.abs(result.sentimentScore ?? 0),
        sentimentDescription: result.recommendation ?? '',
        analysisText: result.strategyDraft ?? '',
        quotedText: responseText.slice(0, 200),
        resolutionProbability: Math.round((result.resolutionProbability ?? 0) * 100),
        strategyDraft: result.strategyDraft ?? '',
      });
    } catch {
      Alert.alert('Analysis Failed', 'Could not analyze the response. Please try again.');
    }
  }, [analyzeResponse, responseText]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleGenerateReply = useCallback(() => {
    router.push('/templates/');
  }, [router]);

  const handleViewFullTemplate = useCallback(() => {
    router.push('/templates/');
  }, [router]);

  const handleReset = useCallback(() => {
    setResponseText('');
    setAnalysis(null);
  }, []);

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
              isAnalyzing={analyzeResponse.isPending}
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
                  analysis={analysis!.analysisText}
                  quotedText={analysis!.quotedText}
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
                  sentiment={analysis!.sentiment}
                  score={analysis!.sentimentScore}
                  description={analysis!.sentimentDescription}
                />
              </View>

              {/* Resolution Probability */}
              <View style={styles.bentoHalfCard}>
                <Card
                  style={styles.probabilityCard}
                  accessibilityLabel={`Resolution probability: ${analysis!.resolutionProbability}%`}
                >
                  <Text style={styles.probabilityLabel}>Resolution{'\n'}Probability</Text>
                  <Text style={styles.probabilityValue}>
                    {analysis!.resolutionProbability}%
                  </Text>
                  <ProgressBar
                    progress={analysis!.resolutionProbability / 100}
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
                  draft={analysis!.strategyDraft}
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
