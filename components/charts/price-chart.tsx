'use client';

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import type { ChartPoint } from '@/lib/market/types';
import { formatCurrency } from '@/lib/utils/format';

type PriceChartProps = {
  points: ChartPoint[];
};

export function PriceChart({ points }: PriceChartProps) {
  const data = points.map((point) => ({
    time: new Date(point.timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }),
    price: Number(point.price.toFixed(6)),
  }));

  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 12, right: 12, bottom: 0, left: 0 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 12 }}
            minTickGap={24}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) =>
              typeof value === 'number'
                ? value >= 1
                  ? `$${value.toFixed(2)}`
                  : `$${value.toFixed(4)}`
                : '$0'
            }
            width={80}
          />
          <Tooltip
            contentStyle={{
              background: 'rgba(10, 13, 25, 0.96)',
              borderRadius: 16,
              border: '1px solid rgba(255,255,255,0.08)',
            }}
            formatter={(value: number) => formatCurrency(value, value < 1 ? 6 : 4)}
          />
          <Line
            type="monotone"
            dataKey="price"
            dot={false}
            strokeWidth={2}
            stroke="hsl(var(--primary))"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
