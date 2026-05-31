"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { MonthlyTrendItem } from "@/lib/finance";

const chartConfig = {
  revenue: {
    label: "Income (Pemasukan)",
    color: "#86efac", // Pastel green
  },
  expense: {
    label: "Expense (Pengeluaran)",
    color: "#fda4af", // Pastel red
  },
} satisfies ChartConfig;

type FinanceChartProps = {
  data: MonthlyTrendItem[];
};

export function FinanceChart({ data }: FinanceChartProps) {
  // Format numbers to Indonesian Rupiah
  const formatYAxis = (value: number) => {
    if (value >= 1_000_000) {
      return `Rp ${(value / 1_000_000).toFixed(1)}jt`;
    }
    if (value >= 1_000) {
      return `Rp ${(value / 1_000).toFixed(0)}rb`;
    }
    return `Rp ${value}`;
  };

  const formatTooltipValue = (value: unknown) => {
    return `Rp ${Number(value).toLocaleString("id-ID")}`;
  };

  return (
    <div className="w-full">
      <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
        <BarChart
          accessibilityLayer
          data={data}
          margin={{
            top: 20,
            right: 12,
            left: 12,
            bottom: 5,
          }}
          barGap={6}
        >
          <CartesianGrid
            strokeDasharray="4 4"
            stroke="#000000"
            strokeOpacity={0.15}
            vertical={false}
          />
          <XAxis
            dataKey="label"
            tickLine={false}
            tickMargin={10}
            axisLine={{ stroke: "#000000", strokeWidth: 2 }}
            className="font-heading font-bold"
          />
          <YAxis
            tickLine={false}
            tickMargin={10}
            axisLine={{ stroke: "#000000", strokeWidth: 2 }}
            tickFormatter={formatYAxis}
            className="font-base"
          />
          <ChartTooltip
            cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
            content={
              <ChartTooltipContent
                indicator="dot"
                formatter={formatTooltipValue}
                className="border-2 border-border shadow-shadow"
              />
            }
          />
          <Bar
            dataKey="revenue"
            fill="var(--color-revenue)"
            radius={[4, 4, 0, 0]}
            stroke="#000000"
            strokeWidth={2}
          />
          <Bar
            dataKey="expense"
            fill="var(--color-expense)"
            radius={[4, 4, 0, 0]}
            stroke="#000000"
            strokeWidth={2}
          />
        </BarChart>
      </ChartContainer>
      <div className="mt-4 flex flex-wrap justify-center gap-6 rounded-base border-2 border-border bg-background p-3 font-base text-sm shadow-shadow">
        <div className="flex items-center gap-2">
          <div className="size-4 rounded-sm border-2 border-border bg-main" style={{ backgroundColor: "#86efac" }} />
          <span>Income (Pemasukan)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="size-4 rounded-sm border-2 border-border bg-main" style={{ backgroundColor: "#fda4af" }} />
          <span>Expense (Pengeluaran)</span>
        </div>
      </div>
    </div>
  );
}
