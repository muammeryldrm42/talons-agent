import { z } from 'zod';

export const timeframeSchema = z.enum(['15m', '1h', '4h', '1d']);
export type Timeframe = z.infer<typeof timeframeSchema>;

export const marketQuerySchema = z.object({
  coinId: z.string().optional(),
  timeframe: timeframeSchema.default('1h'),
});

export const analyzeRequestSchema = z.object({
  coinId: z.string().optional(),
  symbol: z.string().min(1).max(20),
  name: z.string().min(1).max(80),
  timeframe: timeframeSchema.default('1h'),
});

export type AnalyzeRequest = z.infer<typeof analyzeRequestSchema>;
