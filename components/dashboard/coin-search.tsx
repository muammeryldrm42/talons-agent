/* eslint-disable @next/next/no-img-element */
'use client';

import * as React from 'react';
import { Search, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { CoinSearchItem } from '@/lib/market/types';
import { cn } from '@/lib/utils/cn';

type CoinSearchProps = {
  onSelect: (item: CoinSearchItem) => void;
  initialQuery?: string;
};

export function CoinSearch({ onSelect, initialQuery = '' }: CoinSearchProps) {
  const [query, setQuery] = React.useState(initialQuery);
  const [results, setResults] = React.useState<CoinSearchItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  React.useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/coins/search?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
        });
        const data = (await response.json()) as { items: CoinSearchItem[] };
        setResults(data.items ?? []);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  return (
    <div className="relative">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onFocus={() => setOpen(true)}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search BTC, ETH, SOL, Hyperliquid..."
            className="pl-11"
          />
        </div>
        <Button
          variant="secondary"
          onClick={() => {
            const first = results[0];
            if (first) onSelect(first);
          }}
          disabled={results.length === 0}
        >
          <Sparkles className="h-4 w-4" />
          Quick pick
        </Button>
      </div>

      {open && (query.trim().length >= 2 || loading) ? (
        <div className="absolute z-30 mt-3 w-full rounded-3xl border border-border bg-card/95 p-2 shadow-soft backdrop-blur-xl">
          {loading ? (
            <div className="px-4 py-5 text-sm text-muted-foreground">Searching coins...</div>
          ) : results.length === 0 ? (
            <div className="px-4 py-5 text-sm text-muted-foreground">No matching coins found.</div>
          ) : (
            <div className="space-y-1">
              {results.map((item) => (
                <button
                  key={item.coinId}
                  type="button"
                  onClick={() => {
                    onSelect(item);
                    setQuery(`${item.name} (${item.symbol})`);
                    setOpen(false);
                  }}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition hover:bg-secondary',
                  )}
                >
                  {item.image ? (
                    <img src={item.image} alt={item.name} width={24} height={24} className="rounded-full" />
                  ) : (
                    <div className="h-6 w-6 rounded-full bg-secondary" />
                  )}
                  <div className="min-w-0">
                    <div className="truncate font-medium">{item.name}</div>
                    <div className="truncate text-xs uppercase text-muted-foreground">
                      {item.symbol} · {item.coinId}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
