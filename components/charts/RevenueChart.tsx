"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MonthlyRevenue } from "@/lib/db/stats";
import { formatCurrencyCompact, formatMonthLabel } from "@/lib/format";

const SERIES_1 = "var(--series-1)"; // invoiced
const SERIES_2 = "var(--series-2)"; // paid

export function RevenueChart({ data }: { data: MonthlyRevenue[] }) {
  const chartData = data.map((d) => ({ ...d, monthLabel: formatMonthLabel(d.month) }));

  return (
    <div
      className="rounded-xl border p-5"
      style={{ borderColor: "var(--border)", background: "var(--surface-1)" }}
    >
      <h2 className="text-sm font-medium mb-4" style={{ color: "var(--text-primary)" }}>
        Revenue by month
      </h2>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} barGap={2} barCategoryGap="20%">
          <CartesianGrid vertical={false} stroke="var(--gridline)" />
          <XAxis
            dataKey="monthLabel"
            tick={{ fill: "var(--text-muted)", fontSize: 12 }}
            axisLine={{ stroke: "var(--baseline)" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "var(--text-muted)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => formatCurrencyCompact(v)}
            width={56}
          />
          <Tooltip
            cursor={{ fill: "var(--gridline)", opacity: 0.4 }}
            contentStyle={{
              background: "var(--surface-1)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: "var(--text-primary)" }}
            formatter={(value) => formatCurrencyCompact(Number(value))}
          />
          <Legend
            wrapperStyle={{ fontSize: 12, color: "var(--text-secondary)" }}
            iconType="circle"
            iconSize={8}
          />
          <Bar dataKey="invoiced" name="Invoiced" fill={SERIES_1} radius={[4, 4, 0, 0]} maxBarSize={24} />
          <Bar dataKey="paid" name="Paid" fill={SERIES_2} radius={[4, 4, 0, 0]} maxBarSize={24} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
