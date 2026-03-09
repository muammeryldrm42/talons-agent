import { getServerConfig } from '@/lib/config/env';
import { fetchJson } from '@/lib/utils/fetch-json';

const API_BASE = 'https://api.coingecko.com/api/v3';

type CoinGeckoSearchResponse = {
  coins: Array<{
    id: string;
    name: string;
    symbol: string;
    thumb?: string;
  }>;
};

type CoinGeckoMarketsItem = {
  id: string;
  symbol: string;
  name: string;
  image?: string;
  current_price?: number | null;
  price_change_percentage_24h?: number | null;
  total_volume?: number | null;
  market_cap?: number | null;
  high_24h?: number | null;
  low_24h?: number | null;
  circulating_supply?: number | null;
};

type CoinGeckoChartResponse = {
  prices: Array<[number, number]>;
};

function buildHeaders(): HeadersInit {
  const demoKey = getServerConfig().secrets.COINGECKO_DEMO_API_KEY;
  return demoKey ? { 'x-cg-demo-api-key': demoKey } : {};
}

export async function searchCoins(query: string) {
  const normalized = query.trim();
  if (!normalized) return [];

  const data = await fetchJson<CoinGeckoSearchResponse>(
    `${API_BASE}/search?query=${encodeURIComponent(normalized)}`,
    { headers: buildHeaders() },
  );

  return data.coins.slice(0, 8).map((coin) => ({
    coinId: coin.id,
    symbol: coin.symbol.toUpperCase(),
    name: coin.name,
    image: coin.thumb,
  }));
}

export async function resolveCoinId(symbolOrName: string): Promise<string | null> {
  const matches = await searchCoins(symbolOrName);
  if (matches.length === 0) return null;

  const exactSymbol =
    matches.find((item) => item.symbol.toLowerCase() === symbolOrName.toLowerCase()) ?? matches[0];

  return exactSymbol.coinId;
}

export async function fetchCoinMarket(coinId: string) {
  const data = await fetchJson<CoinGeckoMarketsItem[]>(
    `${API_BASE}/coins/markets?vs_currency=usd&ids=${encodeURIComponent(coinId)}&sparkline=false&price_change_percentage=24h`,
    { headers: buildHeaders() },
  );

  return data[0] ?? null;
}

export async function fetchCoinChart(coinId: string, days: number) {
  const data = await fetchJson<CoinGeckoChartResponse>(
    `${API_BASE}/coins/${encodeURIComponent(coinId)}/market_chart?vs_currency=usd&days=${days}`,
    { headers: buildHeaders() },
  );

  return data.prices ?? [];
}
