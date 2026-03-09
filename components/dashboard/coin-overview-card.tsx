/* eslint-disable @next/next/no-img-element */
import { ArrowDownRight, ArrowUpRight, CircleDollarSign } from 'lucide-react';
import type { CoinMarketData } from '@/lib/market/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatCompactNumber, formatCurrency, formatPercent } from '@/lib/utils/format';

type CoinOverviewCardProps = {
  market: CoinMarketData;
  isWatched?: boolean;
  onToggleWatchlist?: () => void;
};

export function CoinOverviewCard({
  market,
  isWatched = false,
  onToggleWatchlist,
}: CoinOverviewCardProps) {
  const positive = (market.change24h ?? 0) >= 0;

  return (
    <Card className="overflow-hidden">
      <CardContent className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          {market.image ? (
            <img src={market.image} alt={market.name} width={56} height={56} className="rounded-full" />
          ) : (
            <div className="h-14 w-14 rounded-full bg-secondary" />
          )}

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-semibold">{market.name}</h2>
              <Badge variant="secondary" className="uppercase">
                {market.symbol}
              </Badge>
              <Badge variant={positive ? 'success' : 'danger'}>
                {positive ? <ArrowUpRight className="mr-1 h-3.5 w-3.5" /> : <ArrowDownRight className="mr-1 h-3.5 w-3.5" />}
                {formatPercent(market.change24h)}
              </Badge>
            </div>
            <div className="mt-1 text-sm text-muted-foreground">Timeframe: {market.timeframe}</div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-border/80 bg-background/60 px-4 py-3">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Price</div>
            <div className="mt-1 text-xl font-semibold">{formatCurrency(market.price, 4)}</div>
          </div>
          <div className="rounded-2xl border border-border/80 bg-background/60 px-4 py-3">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">24h Volume</div>
            <div className="mt-1 text-xl font-semibold">{formatCompactNumber(market.volume24h)}</div>
          </div>
          <div className="rounded-2xl border border-border/80 bg-background/60 px-4 py-3">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Market Cap</div>
            <div className="mt-1 text-xl font-semibold">{formatCompactNumber(market.marketCap)}</div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant={isWatched ? 'secondary' : 'outline'} onClick={onToggleWatchlist}>
            <CircleDollarSign className="h-4 w-4" />
            {isWatched ? 'Saved' : 'Watchlist'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
