import Link from 'next/link';
import { ArrowRight, Bot, CandlestickChart, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const featureCards = [
  {
    icon: CandlestickChart,
    title: 'Live market context',
    description: 'Search coins, inspect recent price action, and read the market with a clean chart-first dashboard.',
  },
  {
    icon: Bot,
    title: 'Structured AI output',
    description: 'Get a concise market bias, confidence score, support, resistance, invalidation, scenarios, and risks.',
  },
  {
    icon: ShieldCheck,
    title: 'Built for analysis only',
    description: 'No wallets, no trade execution, no hype. Talons Agent focuses on safer decision support.',
  },
];

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="grid-pattern absolute inset-0 opacity-30" />
      <section className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.24em] text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Talons Agent
          </div>

          <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
            AI crypto analysis that stays focused on market context.
          </h1>

          <p className="max-w-2xl text-lg text-muted-foreground">
            Talons Agent helps you search crypto markets, view recent price structure, and generate
            a disciplined AI summary without pretending to trade for you.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/dashboard">
                Open dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/settings">Setup guide</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {featureCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card key={card.title} className="bg-card/80 backdrop-blur">
                <CardHeader>
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle>{card.title}</CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        <Card className="border-primary/15 bg-primary/5">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">
              Talons Agent provides market commentary and structured analysis only. It is not financial
              advice and does not place trades, connect wallets, or automate execution.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
