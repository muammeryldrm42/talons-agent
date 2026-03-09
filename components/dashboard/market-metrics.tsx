import { Activity, ShieldAlert, TrendingUp } from 'lucide-react';
import type { CoinMarketData } from '@/lib/market/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCompactNumber, formatCurrency } from '@/lib/utils/format';

type MarketMetricsProps = {
  market: CoinMarketData;
};

export function MarketMetrics({ market }: MarketMetricsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-4 w-4 text-primary" />
            Momentum
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">EMA trend</span>
            <Badge
              variant={
                market.indicators.emaTrend === 'bullish'
                  ? 'success'
                  : market.indicators.emaTrend === 'bearish'
                    ? 'danger'
                    : 'neutral'
              }
            >
              {market.indicators.emaTrend}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">RSI(14)</span>
            <span className="font-medium">{market.indicators.rsi14 ?? '—'}</span>
          </div>
          <div className="rounded-2xl bg-background/60 p-3 text-sm text-muted-foreground">
            A quick directional snapshot using recent chart points, not a signal engine.
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Activity className="h-4 w-4 text-primary" />
            Market range
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">24h High</span>
            <span className="font-medium">{formatCurrency(market.marketSummary.priceHigh24h, 4)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">24h Low</span>
            <span className="font-medium">{formatCurrency(market.marketSummary.priceLow24h, 4)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Volatility</span>
            <span className="font-medium">
              {market.indicators.volatility24h !== null ? `${market.indicators.volatility24h}%` : '—'}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <ShieldAlert className="h-4 w-4 text-primary" />
            Liquidity context
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">24h Volume</span>
            <span className="font-medium">{formatCompactNumber(market.volume24h)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Market Cap</span>
            <span className="font-medium">{formatCompactNumber(market.marketCap)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Circulating supply</span>
            <span className="font-medium">{formatCompactNumber(market.marketSummary.circulatingSupply)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
