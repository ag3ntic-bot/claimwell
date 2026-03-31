import type { AIOutput, AIStrategy } from '@/types';

export const mockStrategyOutput: AIOutput = {
  content: JSON.stringify({
    recommendation: 'Send Formal Appeal Letter',
    steps: [
      {
        order: 1,
        action: 'Compile all evidence into a single organized package',
        rationale:
          'A complete evidence package strengthens the appeal and demonstrates thorough preparation. Include the defect photos, purchase receipt, chat transcript, denial email, and warranty terms.',
      },
      {
        order: 2,
        action:
          'Send formal appeal letter to Apple Customer Relations via certified mail and email',
        rationale:
          'A written appeal creates a paper trail and triggers formal review processes. The assertive tone draft (v2.4) addresses each denial point, cites the Magnuson-Moss Warranty Act, and references the support agent contradiction.',
      },
      {
        order: 3,
        action: 'Request a written diagnostic report from Apple',
        rationale:
          "Apple's denial did not include diagnostic findings. Requesting this report puts Apple in a difficult position — if they can't produce one, the denial lacks evidentiary support.",
      },
      {
        order: 4,
        action: 'Prepare executive escalation if appeal is denied within 14 business days',
        rationale:
          'If the formal appeal fails, escalating to Apple Executive Relations (and referencing potential FTC/AG complaints) significantly increases resolution probability. Historical data shows 68% of executive escalations result in a favorable outcome.',
      },
    ],
  } satisfies AIStrategy),
  structured: {
    recommendation: 'Send Formal Appeal Letter',
    steps: [
      {
        order: 1,
        action: 'Compile all evidence into a single organized package',
        rationale:
          'A complete evidence package strengthens the appeal and demonstrates thorough preparation. Include the defect photos, purchase receipt, chat transcript, denial email, and warranty terms.',
      },
      {
        order: 2,
        action:
          'Send formal appeal letter to Apple Customer Relations via certified mail and email',
        rationale:
          'A written appeal creates a paper trail and triggers formal review processes. The assertive tone draft (v2.4) addresses each denial point, cites the Magnuson-Moss Warranty Act, and references the support agent contradiction.',
      },
      {
        order: 3,
        action: 'Request a written diagnostic report from Apple',
        rationale:
          "Apple's denial did not include diagnostic findings. Requesting this report puts Apple in a difficult position — if they can't produce one, the denial lacks evidentiary support.",
      },
      {
        order: 4,
        action: 'Prepare executive escalation if appeal is denied within 14 business days',
        rationale:
          'If the formal appeal fails, escalating to Apple Executive Relations (and referencing potential FTC/AG complaints) significantly increases resolution probability. Historical data shows 68% of executive escalations result in a favorable outcome.',
      },
    ],
  },
  tokensUsed: 892,
  model: 'claude-sonnet-4-20250514',
  latencyMs: 4350,
  cached: false,
};
