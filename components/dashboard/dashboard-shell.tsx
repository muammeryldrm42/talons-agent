'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { CoinSearch } from '@/components/dashboard/coin-search';
import { CoinOverviewCard } from '@/components/dashboard/coin-overview-card';
import { MarketMetrics } from '@/components/dashboard/market-metrics';
import { AnalysisPanel } from '@/components/dashboard/analysis-panel';
import { PriceChart } from '@/components/charts/price-chart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { CoinMarketData, CoinSearchItem } from '@/lib/market/types';
import type { AnalysisResponse } from '@/lib/schemas/analysis';
import { addHistory, getWatchlist, toggleWatchlist, type WatchlistItem } from '@/lib/storage/browser';

const DEFAULT_COIN: CoinSearchItem = {
  coinId: 'bitcoin',
  symbol: 'BTC',
  name: 'Bitcoin',
  image: 'https://coin-images.coingecko.com/coins/images/1/thumb/bitcoin.png',
};

export function DashboardShell() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCoin, setSelectedCoin] = React.useState<CoinSearchItem>(DEFAULT_COIN);
  const [timeframe, setTimeframe] = React.useState<'15m' | '1h' | '4h' | '1d'>('1h');
  const [market, setMarket] = React.useState<CoinMarketData | null>(null);
  const [analysis, setAnalysis] = React.useState<AnalysisResponse | null>(null);
  const [watchlist, setWatchlist] = React.useState<WatchlistItem[]>([]);
  const [loadingMarket, setLoadingMarket] = React.useState(false);
  const [loadingAnalysis, setLoadingAnalysis] = React.useState(false);

  React.useEffect(() => {
    setWatchlist(getWatchlist());

    const symbol = searchParams.get('symbol');
    const coinId = searchParams.get('coinId');
    const name = searchParams.get('name');

    if (symbol && name) {
      setSelectedCoin({
        coinId: coinId ?? symbol.toLowerCase(),
        symbol: symbol.toUpperCase(),
        name,
      });
    }
  }, [searchParams]);

  React.useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        setLoadingMarket(true);
        const response = await fetch(
          `/api/market/${encodeURIComponent(selectedCoin.symbol)}?coinId=${encodeURIComponent(selectedCoin.coinId)}&timeframe=${timeframe}`,
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error ?? 'Failed to load market data.');
        }

        if (!ignore) {
          setMarket(data.market as CoinMarketData);
          setAnalysis(null);
        }
      } catch (error) {
        if (!ignore) {
          setMarket(null);
          toast.error(error instanceof Error ? error.message : 'Failed to load market data.');
        }
      } finally {
        if (!ignore) {
          setLoadingMarket(false);
        }
      }
    }

    void load();

    return () => {
      ignore = true;
    };
  }, [selectedCoin, timeframe]);

  const isWatched = watchlist.some((item) => item.coinId === selectedCoin.coinId);

  async function runAnalysis() {
    if (!market) return;

    try {
      setLoadingAnalysis(true);
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          coinId: selectedCoin.coinId,
          symbol: selectedCoin.symbol,
          name: selectedCoin.name,
          timeframe,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? 'Analysis failed.');
      }

      const nextAnalysis = data.analysis as AnalysisResponse;
      setAnalysis(nextAnalysis);

      addHistory({
        id: crypto.randomUUID(),
        coinId: selectedCoin.coinId,
        symbol: selectedCoin.symbol,
        name: selectedCoin.name,
        timeframe,
        createdAt: new Date().toISOString(),
        analysis: nextAnalysis,
      });

      toast.success(`Analysis ready for ${selectedCoin.symbol}.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Analysis failed.');
    } finally {
      setLoadingAnalysis(false);
    }
  }

  function handleSelectCoin(item: CoinSearchItem) {
    setSelectedCoin(item);
    router.replace(`/dashboard?coinId=${item.coinId}&symbol=${item.symbol}&name=${encodeURIComponent(item.name)}`);
  }

  function handleToggleWatchlist() {
    const result = toggleWatchlist({
      coinId: selectedCoin.coinId,
      symbol: selectedCoin.symbol,
      name: selectedCoin.name,
      image: market?.image,
    });

    setWatchlist(result.items);
    toast.success(result.added ? 'Added to watchlist.' : 'Removed from watchlist.');
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-3">
        <div className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-primary">
          Analysis only
        </div>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Crypto Analysis Agent</h1>
        <p className="max-w-2xl text-muted-foreground">
          Search a market, inspect recent price context, then let Talons Agent produce a structured AI read.
        </p>
      </div>

      <CoinSearch onSelect={handleSelectCoin} initialQuery={`${selectedCoin.name} (${selectedCoin.symbol})`} />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Tabs value={timeframe} onValueChange={(value) => setTimeframe(value as typeof timeframe)}>
          <TabsList>
            <TabsTrigger value="15m">15m</TabsTrigger>
            <TabsTrigger value="1h">1h</TabsTrigger>
            <TabsTrigger value="4h">4h</TabsTrigger>
            <TabsTrigger value="1d">1d</TabsTrigger>
          </TabsList>
        </Tabs>

        <Button onClick={() => void runAnalysis()} disabled={!market || loadingAnalysis}>
          {loadingAnalysis ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          Analyze with AI
        </Button>
      </div>

      {loadingMarket ? (
        <div className="grid gap-4">
          <Skeleton className="h-40 w-full rounded-3xl" />
          <div className="grid gap-4 md:grid-cols-3">
            <Skeleton className="h-48 rounded-3xl" />
            <Skeleton className="h-48 rounded-3xl" />
            <Skeleton className="h-48 rounded-3xl" />
          </div>
          <Skeleton className="h-[380px] rounded-3xl" />
        </div>
      ) : market ? (
        <>
          <CoinOverviewCard
            market={market}
            isWatched={isWatched}
            onToggleWatchlist={handleToggleWatchlist}
          />

          <MarketMetrics market={market} />

          <Card>
            <CardHeader>
              <CardTitle>Price context</CardTitle>
              <CardDescription>
                Recent price data from CoinGecko, rendered for the selected timeframe.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PriceChart points={market.chart} />
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No market loaded</CardTitle>
            <CardDescription>
              Search for a coin to load its market overview and recent chart context.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <AnalysisPanel analysis={analysis} />
    </div>
  );
}
