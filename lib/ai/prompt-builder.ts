import type { CoinMarketData } from '@/lib/market/types';

function compact(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(value)) return 'unknown';
  return value;
}

export function buildAnalysisInstructions() {
  return [
    'You are Talons Agent, a disciplined crypto market analyst.',
    'You analyze one coin at a time using only the supplied market data.',
    'Never guarantee profit, never recommend leverage, and never say a coin will definitely pump or dump.',
    'If data is weak or incomplete, say so directly.',
    'Return valid JSON only. No markdown, no prose outside JSON.',
    'Keep summary concise and reasoning practical.',
    'Suggested scenarios should be scenario-based, not commands.',
    'Risks must include uncertainty and invalidation awareness.',
    'Use the exact schema requested by the developer message.',
  ].join(' ');
}

export function buildAnalysisInput(market: CoinMarketData) {
  return [
    `Coin: ${market.name} (${market.symbol})`,
    `Coin ID: ${market.coinId}`,
    `Timeframe: ${market.timeframe}`,
    `Current price: ${compact(market.price)}`,
    `24h change %: ${compact(market.change24h)}`,
    `24h volume: ${compact(market.volume24h)}`,
    `Market cap: ${compact(market.marketCap)}`,
    `24h high: ${compact(market.marketSummary.priceHigh24h)}`,
    `24h low: ${compact(market.marketSummary.priceLow24h)}`,
    `Circulating supply: ${compact(market.marketSummary.circulatingSupply)}`,
    `RSI(14): ${compact(market.indicators.rsi14)}`,
    `EMA trend: ${market.indicators.emaTrend}`,
    `Volatility snapshot %: ${compact(market.indicators.volatility24h)}`,
    `Recent chart points (timestamp_ms, price): ${JSON.stringify(market.chart.slice(-40))}`,
    'Return this JSON shape exactly:',
    JSON.stringify(
      {
        coin: market.symbol,
        marketBias: 'bullish | bearish | neutral',
        confidence: 0,
        summary: '',
        supportZone: '',
        resistanceZone: '',
        invalidationLevel: '',
        momentum: '',
        suggestedScenarios: [''],
        risks: [''],
        reasoning: [''],
        timestamp: new Date().toISOString(),
      },
      null,
      2,
    ),
  ].join('\n');
}
