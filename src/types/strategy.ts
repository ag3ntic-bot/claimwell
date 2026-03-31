export type EscalationStepStatus = 'completed' | 'active' | 'pending';

export interface EscalationStep {
  order: number;
  title: string;
  description: string;
  status: EscalationStepStatus;
  date: string | null;
}

export interface AttentionItem {
  icon: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

export interface Strategy {
  claimId: string;
  recommendedAction: string;
  actionDescription: string;
  claimStrength: number;
  winProbability: number;
  attentionItems: AttentionItem[];
  escalationLadder: EscalationStep[];
  daysLeftToAppeal: number | null;
  aiSummary: string;
  generatedAt: string;
}

export interface ResponseAnalysis {
  sentiment: string;
  sentimentScore: number;
  resolutionProbability: number;
  tactics: string[];
  recommendation: string;
  strategyDraft: string;
  quotedText: string;
}
