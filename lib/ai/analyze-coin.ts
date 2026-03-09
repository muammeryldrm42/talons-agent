import OpenAI from 'openai';
import type { AnalyzeRequest } from '@/lib/schemas/api';
import { analysisResponseSchema, type AnalysisResponse } from '@/lib/schemas/analysis';
import { getOpenAIClient } from '@/lib/ai/openai-client';
import { buildAnalysisInput, buildAnalysisInstructions } from '@/lib/ai/prompt-builder';
import { getServerConfig } from '@/lib/config/env';
import { getCoinMarketData } from '@/lib/market/service';
import { extractJsonObject } from '@/lib/utils/json';

function fallbackAnalysis(symbol: string, name: string, reason: string): AnalysisResponse {
  return {
    coin: symbol.toUpperCase(),
    marketBias: 'neutral',
    confidence: 15,
    summary: `Talons Agent could not produce a reliable analysis for ${name}.`,
    supportZone: 'Insufficient data',
    resistanceZone: 'Insufficient data',
    invalidationLevel: 'Insufficient data',
    momentum: 'Insufficient data',
    suggestedScenarios: ['Wait for cleaner market data before making a directional read.'],
    risks: [reason],
    reasoning: ['The model output was invalid or market data quality was too weak.'],
    timestamp: new Date().toISOString(),
  };
}

async function requestStructuredAnalysis(
  client: OpenAI,
  model: string,
  input: string,
  retryMessage?: string,
) {
  const response = await client.responses.create({
    model,
    instructions: buildAnalysisInstructions(),
    input: retryMessage ? `${input}\n\nRetry instruction: ${retryMessage}` : input,
    // Structured output via the Responses API can be strict depending on SDK/version.
    // We still validate with Zod after parsing output_text to remain resilient.
  });

  return response.output_text;
}

export async function analyzeCoin(payload: AnalyzeRequest) {
  const config = getServerConfig();
  const market = await getCoinMarketData(payload.symbol, payload.timeframe, payload.coinId);
  const client = getOpenAIClient();
  const model = config.model;
  const baseInput = buildAnalysisInput(market);

  let text = await requestStructuredAnalysis(client, model, baseInput);
  let parsedText = extractJsonObject(text);

  if (!parsedText) {
    text = await requestStructuredAnalysis(
      client,
      model,
      baseInput,
      'Your last answer was invalid. Return only a single valid JSON object that matches the required schema exactly.',
    );
    parsedText = extractJsonObject(text);
  }

  if (!parsedText) {
    return {
      market,
      analysis: fallbackAnalysis(payload.symbol, payload.name, 'Model did not return valid JSON.'),
    };
  }

  try {
    const parsed = JSON.parse(parsedText);
    const analysis = analysisResponseSchema.parse(parsed);
    return {
      market,
      analysis,
    };
  } catch (error) {
    return {
      market,
      analysis: fallbackAnalysis(
        payload.symbol,
        payload.name,
        error instanceof Error ? error.message : 'Unknown parsing error.',
      ),
    };
  }
}
