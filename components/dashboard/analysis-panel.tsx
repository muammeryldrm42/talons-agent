import type { ComponentType } from 'react';
import { AlertTriangle, BrainCircuit, Shield, Sparkles } from 'lucide-react';
import type { AnalysisResponse } from '@/lib/schemas/analysis';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDateTime } from '@/lib/utils/format';

type AnalysisPanelProps = {
  analysis: AnalysisResponse | null;
};

export function AnalysisPanel({ analysis }: AnalysisPanelProps) {
  if (!analysis) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI analysis</CardTitle>
          <CardDescription>
            Pick a coin and run Talons Agent to generate a structured market read.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const variant =
    analysis.marketBias === 'bullish'
      ? 'success'
      : analysis.marketBias === 'bearish'
        ? 'danger'
        : 'neutral';

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI analysis
            </CardTitle>
            <CardDescription>Generated {formatDateTime(analysis.timestamp)}</CardDescription>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant={variant}>{analysis.marketBias}</Badge>
            <Badge variant="secondary">Confidence {analysis.confidence}/100</Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <section className="rounded-2xl border border-border/70 bg-background/50 p-4">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">Summary</div>
          <p className="mt-2 leading-7">{analysis.summary}</p>
        </section>

        <div className="grid gap-4 md:grid-cols-3">
          <InfoTile label="Support zone" value={analysis.supportZone} />
          <InfoTile label="Resistance zone" value={analysis.resistanceZone} />
          <InfoTile label="Invalidation" value={analysis.invalidationLevel} />
        </div>

        <section className="grid gap-4 lg:grid-cols-3">
          <ListCard
            title="Momentum"
            icon={BrainCircuit}
            items={[analysis.momentum]}
          />
          <ListCard title="Scenarios" icon={Shield} items={analysis.suggestedScenarios} />
          <ListCard title="Risks" icon={AlertTriangle} items={analysis.risks} />
        </section>

        <section className="rounded-2xl border border-border/70 bg-background/50 p-4">
          <div className="mb-3 text-sm font-medium">Reasoning</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {analysis.reasoning.map((item) => (
              <li key={item} className="rounded-xl bg-secondary/40 px-3 py-2">
                {item}
              </li>
            ))}
          </ul>
        </section>
      </CardContent>
    </Card>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/50 p-4">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-2 text-sm font-medium">{value}</div>
    </div>
  );
}

function ListCard({
  title,
  icon: Icon,
  items,
}: {
  title: string;
  icon: ComponentType<{ className?: string }>;
  items: string[];
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/50 p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-medium">
        <Icon className="h-4 w-4 text-primary" />
        {title}
      </div>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {items.map((item) => (
          <li key={item} className="rounded-xl bg-secondary/40 px-3 py-2">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
