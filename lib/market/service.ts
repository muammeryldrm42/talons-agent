import type { Timeframe } from '@/lib/schemas/api';
import type { CoinMarketData } from '@/lib/market/types';
import { fetchCoinChart, fetchCoinMarket, resolveCoinId } from '@/lib/market/coingecko';
import { computeRsi, computeVolatility, detectEmaTrend } from '@/lib/market/indicators';

const TIMEFRAME_TO_DAYS: Record<Timeframe, number> = {
  '15m': 1,
  '1h': 1,
  '4h': 7,
  '1d': 30,
};

const TIMEFRAME_TO_MAX_POINTS: Record<Timeframe, number> = {
  '15m': 96,
  '1h': 48,
  '4h': 60,
  '1d': 90,
};

function downSample(points: Array<[number, number]>, maxPoints: number) {
  if (points.length <= maxPoints) return points;

  const step = Math.ceil(points.length / maxPoints);
  return points.filter((_, index) => index % step === 0).slice(-maxPoints);
}

export async function getCoinMarketData(
  symbolOrName: string,
  timeframe: Timeframe,
  coinId?: string,
): Promise<CoinMarketData> {
  const resolvedCoinId = coinId || (await resolveCoinId(symbolOrName));

  if (!resolvedCoinId) {
    throw new Error(`Could not find a coin that matches "${symbolOrName}".`);
  }

  const [market, chartResponse] = await Promise.all([
    fetchCoinMarket(resolvedCoinId),
    fetchCoinChart(resolvedCoinId, TIMEFRAME_TO_DAYS[timeframe]),
  ]);

  if (!market) {
    throw new Error(`No market data is currently available for "${symbolOrName}".`);
  }

  const sampled = downSample(chartResponse, TIMEFRAME_TO_MAX_POINTS[timeframe]);
  const prices = sampled.map((entry) => entry[1]);

  return {
    coinId: resolvedCoinId,
    symbol: market.symbol.toUpperCase(),
    name: market.name,
    image: market.image,
    price: market.current_price ?? null,
    change24h: market.price_change_percentage_24h ?? null,
    volume24h: market.total_volume ?? null,
    marketCap: market.market_cap ?? null,
    timeframe,
    chart: sampled.map(([timestamp, price]) => ({
      timestamp,
      price,
    })),
    indicators: {
      rsi14: computeRsi(prices),
      emaTrend: detectEmaTrend(prices),
      volatility24h: computeVolatility(prices),
    },
    marketSummary: {
      priceHigh24h: market.high_24h ?? null,
      priceLow24h: market.low_24h ?? null,
      circulatingSupply: market.circulating_supply ?? null,
    },
  };
}
