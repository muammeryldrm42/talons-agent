'use client';

import * as React from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getHistory, type HistoryItem } from '@/lib/storage/browser';
import { formatDateTime } from '@/lib/utils/format';

export default function HistoryPage() {
  const [items, setItems] = React.useState<HistoryItem[]>([]);
  const [filter, setFilter] = React.useState('');

  React.useEffect(() => {
    setItems(getHistory());
  }, []);

  const filtered = items.filter((item) => {
    const term = filter.trim().toLowerCase();
    if (!term) return true;
    return (
      item.symbol.toLowerCase().includes(term) ||
      item.name.toLowerCase().includes(term) ||
      item.analysis.marketBias.toLowerCase().includes(term)
    );
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight">Analysis history</h1>
        <p className="text-muted-foreground">Past AI analyses are stored locally in your browser for the MVP.</p>
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            placeholder="Filter by coin or bias..."
            className="pl-11"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No analysis history yet</CardTitle>
            <CardDescription>Run an analysis from the dashboard to populate this page.</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filtered.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <CardTitle>
                      {item.name} <span className="text-muted-foreground">({item.symbol})</span>
                    </CardTitle>
                    <CardDescription>
                      {formatDateTime(item.createdAt)} · {item.timeframe}
                    </CardDescription>
                  </div>
                  <Badge
                    variant={
                      item.analysis.marketBias === 'bullish'
                        ? 'success'
                        : item.analysis.marketBias === 'bearish'
                          ? 'danger'
                          : 'neutral'
                    }
                  >
                    {item.analysis.marketBias}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{item.analysis.summary}</p>
                <div className="grid gap-4 md:grid-cols-3">
                  <MiniTile label="Support" value={item.analysis.supportZone} />
                  <MiniTile label="Resistance" value={item.analysis.resistanceZone} />
                  <MiniTile label="Invalidation" value={item.analysis.invalidationLevel} />
                </div>
                <Button asChild variant="outline">
                  <Link href={`/dashboard?coinId=${item.coinId ?? item.symbol.toLowerCase()}&symbol=${item.symbol}&name=${encodeURIComponent(item.name)}`}>
                    Re-open on dashboard
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function MiniTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/50 p-4">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-2 text-sm font-medium">{value}</div>
    </div>
  );
}
