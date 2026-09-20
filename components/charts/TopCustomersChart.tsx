"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { LabelProps } from "recharts";
import type { CustomerTotal } from "@/lib/db/stats";
import { formatCurrencyCompact } from "@/lib/format";

const SERIES_1 = "var(--series-1)";

export function TopCustomersChart({ data }: { data: CustomerTotal[] }) {
  const chartData = [...data].reverse();

  return (
    <div
      className="rounded-xl border p-5"
      style={{ borderColor: "var(--border)", background: "var(--surface-1)" }}
    >
      <h2 className="text-sm font-medium mb-4" style={{ color: "var(--text-primary)" }}>
        Top customers by invoiced amount
      </h2>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 32 }}>
          <CartesianGrid horizontal={false} stroke="var(--gridline)" />
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="customerName"
            tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={140}
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
          <Bar dataKey="invoiced" radius={[0, 4, 4, 0]} maxBarSize={20} label={renderEndLabel}>
            {chartData.map((entry) => (
              <Cell key={entry.customerName} fill={SERIES_1} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function renderEndLabel(props: LabelProps) {
  const x = Number(props.x ?? 0);
  const y = Number(props.y ?? 0);
  const width = Number(props.width ?? 0);
  const height = Number(props.height ?? 0);
  const value = Number(props.value ?? 0);
  return (
    <text
      x={x + width + 6}
      y={y + height / 2}
      dy={4}
      fontSize={12}
      fill="var(--text-secondary)"
    >
      {formatCurrencyCompact(value)}
    </text>
  );
}
