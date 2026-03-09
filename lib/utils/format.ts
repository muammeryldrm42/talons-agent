export function formatCurrency(
  value: number | null | undefined,
  maximumFractionDigits = 2,
): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '—';
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits,
  }).format(value);
}

export function formatCompactNumber(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '—';
  }

  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '—';
  }

  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export function formatDateTime(value: string | number | Date): string {
  const date = new Date(value);
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export function formatRelativeShort(value: string | number | Date): string {
  const date = new Date(value).getTime();
  const now = Date.now();
  const deltaMinutes = Math.round((date - now) / 60000);

  const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  const abs = Math.abs(deltaMinutes);
  if (abs < 60) return formatter.format(deltaMinutes, 'minute');

  const deltaHours = Math.round(deltaMinutes / 60);
  if (Math.abs(deltaHours) < 24) return formatter.format(deltaHours, 'hour');

  const deltaDays = Math.round(deltaHours / 24);
  return formatter.format(deltaDays, 'day');
}
