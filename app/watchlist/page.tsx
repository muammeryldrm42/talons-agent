/* eslint-disable @next/next/no-img-element */
'use client';

import * as React from 'react';
import Link from 'next/link';
import { ExternalLink, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getWatchlist, saveWatchlist, type WatchlistItem } from '@/lib/storage/browser';
import { toast } from 'sonner';

export default function WatchlistPage() {
  const [items, setItems] = React.useState<WatchlistItem[]>([]);

  React.useEffect(() => {
    setItems(getWatchlist());
  }, []);

  function removeItem(coinId: string) {
    const next = items.filter((item) => item.coinId !== coinId);
    setItems(next);
    saveWatchlist(next);
    toast.success('Removed from watchlist.');
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 space-y-2">
        <h1 className="text-4xl font-semibold tracking-tight">Watchlist</h1>
        <p className="text-muted-foreground">Saved coins are stored locally in your browser for the MVP.</p>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No saved coins yet</CardTitle>
            <CardDescription>Add a market from the dashboard to build your local watchlist.</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4">
          {items.map((item) => (
            <Card key={item.coinId}>
              <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  {item.image ? (
                    <img src={item.image} alt={item.name} width={40} height={40} className="rounded-full" />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-secondary" />
                  )}
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm uppercase text-muted-foreground">{item.symbol}</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button asChild variant="outline">
                    <Link href={`/dashboard?coinId=${item.coinId}&symbol=${item.symbol}&name=${encodeURIComponent(item.name)}`}>
                      Open
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="secondary" onClick={() => removeItem(item.coinId)}>
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
