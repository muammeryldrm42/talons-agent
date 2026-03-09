import type { Timeframe } from '@/lib/schemas/api';

export type CoinSearchItem = {
  coinId: string;
  symbol: string;
  name: string;
  image?: string;
};

export type ChartPoint = {
  timestamp: number;
  price: number;
};

export type CoinMarketData = {
  coinId: string;
  symbol: string;
  name: string;
  image?: string;
  price: number | null;
  change24h: number | null;
  volume24h: number | null;
  marketCap: number | null;
  timeframe: Timeframe;
  chart: ChartPoint[];
  indicators: {
    rsi14: number | null;
    emaTrend: 'bullish' | 'bearish' | 'neutral';
    volatility24h: number | null;
  };
  marketSummary: {
    priceHigh24h: number | null;
    priceLow24h: number | null;
    circulatingSupply: number | null;
  };
};
