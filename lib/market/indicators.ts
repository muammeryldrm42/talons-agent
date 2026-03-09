export function computeEma(values: number[], period: number): number[] {
  if (values.length === 0 || period <= 0) return [];

  const multiplier = 2 / (period + 1);
  const result: number[] = [];
  let ema = values[0] ?? 0;
  result.push(ema);

  for (let index = 1; index < values.length; index += 1) {
    ema = (values[index] ?? ema) * multiplier + ema * (1 - multiplier);
    result.push(ema);
  }

  return result;
}

export function computeRsi(values: number[], period = 14): number | null {
  if (values.length < period + 1) return null;

  let gains = 0;
  let losses = 0;

  for (let index = 1; index <= period; index += 1) {
    const delta = (values[index] ?? 0) - (values[index - 1] ?? 0);
    if (delta >= 0) gains += delta;
    else losses += Math.abs(delta);
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  for (let index = period + 1; index < values.length; index += 1) {
    const delta = (values[index] ?? 0) - (values[index - 1] ?? 0);
    const gain = delta > 0 ? delta : 0;
    const loss = delta < 0 ? Math.abs(delta) : 0;

    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
  }

  if (avgLoss === 0) return 100;

  const rs = avgGain / avgLoss;
  return Number((100 - 100 / (1 + rs)).toFixed(2));
}

export function computeVolatility(values: number[]): number | null {
  if (values.length < 2) return null;

  const returns: number[] = [];
  for (let index = 1; index < values.length; index += 1) {
    const prev = values[index - 1] ?? 0;
    const current = values[index] ?? 0;
    if (!prev) continue;
    returns.push((current - prev) / prev);
  }

  if (returns.length === 0) return null;

  const mean = returns.reduce((sum, value) => sum + value, 0) / returns.length;
  const variance =
    returns.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / returns.length;

  return Number((Math.sqrt(variance) * 100).toFixed(2));
}

export function detectEmaTrend(values: number[]): 'bullish' | 'bearish' | 'neutral' {
  if (values.length < 21) return 'neutral';

  const ema9 = computeEma(values, 9).at(-1);
  const ema21 = computeEma(values, 21).at(-1);

  if (ema9 === undefined || ema21 === undefined) return 'neutral';
  if (ema9 > ema21 * 1.002) return 'bullish';
  if (ema9 < ema21 * 0.998) return 'bearish';
  return 'neutral';
}
