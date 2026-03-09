import { z } from 'zod';

export const analysisResponseSchema = z.object({
  coin: z.string().min(1),
  marketBias: z.enum(['bullish', 'bearish', 'neutral']),
  confidence: z.number().int().min(0).max(100),
  summary: z.string().min(1),
  supportZone: z.string().min(1),
  resistanceZone: z.string().min(1),
  invalidationLevel: z.string().min(1),
  momentum: z.string().min(1),
  suggestedScenarios: z.array(z.string().min(1)).min(1).max(4),
  risks: z.array(z.string().min(1)).min(1).max(5),
  reasoning: z.array(z.string().min(1)).min(1).max(5),
  timestamp: z.string().datetime(),
});

export type AnalysisResponse = z.infer<typeof analysisResponseSchema>;

export const ANALYSIS_JSON_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: [
    'coin',
    'marketBias',
    'confidence',
    'summary',
    'supportZone',
    'resistanceZone',
    'invalidationLevel',
    'momentum',
    'suggestedScenarios',
    'risks',
    'reasoning',
    'timestamp',
  ],
  properties: {
    coin: { type: 'string' },
    marketBias: { type: 'string', enum: ['bullish', 'bearish', 'neutral'] },
    confidence: { type: 'integer', minimum: 0, maximum: 100 },
    summary: { type: 'string' },
    supportZone: { type: 'string' },
    resistanceZone: { type: 'string' },
    invalidationLevel: { type: 'string' },
    momentum: { type: 'string' },
    suggestedScenarios: {
      type: 'array',
      minItems: 1,
      maxItems: 4,
      items: { type: 'string' },
    },
    risks: {
      type: 'array',
      minItems: 1,
      maxItems: 5,
      items: { type: 'string' },
    },
    reasoning: {
      type: 'array',
      minItems: 1,
      maxItems: 5,
      items: { type: 'string' },
    },
    timestamp: { type: 'string' },
  },
} as const;
