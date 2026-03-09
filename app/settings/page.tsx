'use client';

import * as React from 'react';
import { CheckCircle2, CircleAlert, Settings2 } from 'lucide-react';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type ConfigStatus = {
  appName: string;
  isProduction: boolean;
  usingLocalConfig: boolean;
  hasOpenAIKey: boolean;
  hasCoinGeckoKey: boolean;
  model: string;
};

export default function SettingsPage() {
  const [status, setStatus] = React.useState<ConfigStatus | null>(null);

  React.useEffect(() => {
    async function load() {
      const response = await fetch('/api/config-status');
      const data = (await response.json()) as ConfigStatus;
      setStatus(data);
    }

    void load();
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.24em] text-primary">
          <Settings2 className="h-3.5 w-3.5" />
          Settings
        </div>
        <h1 className="text-4xl font-semibold tracking-tight">App setup</h1>
        <p className="text-muted-foreground">
          Talons Agent reads Vercel environment variables in production and falls back to local config
          during local development.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Theme</CardTitle>
            <CardDescription>Dark mode is enabled by default, but you can switch anytime.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Appearance</span>
            <ThemeToggle />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Config status</CardTitle>
            <CardDescription>Server-side secret availability and active model configuration.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ConfigLine label="Mode" value={status ? (status.isProduction ? 'production' : 'development') : 'Loading...'} />
            <ConfigLine label="OpenAI model" value={status?.model ?? 'Loading...'} />
            <div className="flex flex-wrap gap-2">
              <StatusBadge label="OpenAI key" ok={Boolean(status?.hasOpenAIKey)} />
              <StatusBadge label="CoinGecko demo key" ok={Boolean(status?.hasCoinGeckoKey)} />
              <Badge variant="secondary">{status?.usingLocalConfig ? 'local config detected' : 'env mode'}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Local setup tip</CardTitle>
          <CardDescription>
            Edit <code className="rounded bg-secondary px-1 py-0.5">config/local.secrets.ts</code> for local development.
            In Vercel, set the same values as environment variables instead.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

function ConfigLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/50 px-4 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function StatusBadge({ label, ok }: { label: string; ok: boolean }) {
  return (
    <Badge variant={ok ? 'success' : 'warning'} className="gap-1.5">
      {ok ? <CheckCircle2 className="h-3.5 w-3.5" /> : <CircleAlert className="h-3.5 w-3.5" />}
      {label}
    </Badge>
  );
}
