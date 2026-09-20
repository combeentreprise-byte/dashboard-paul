"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { LabelProps } from "recharts";
import { InvoiceStatus } from "@prisma/client";
import type { StatusBreakdown } from "@/lib/db/stats";
import { formatCurrencyCompact } from "@/lib/format";

const STATUS_ORDER: InvoiceStatus[] = [
  InvoiceStatus.PAID,
  InvoiceStatus.OPEN,
  InvoiceStatus.OVERDUE,
  InvoiceStatus.DRAFT,
  InvoiceStatus.CANCELLED,
];

const STATUS_LABEL: Record<InvoiceStatus, string> = {
  PAID: "Paid",
  OPEN: "Open",
  OVERDUE: "Overdue",
  DRAFT: "Draft",
  CANCELLED: "Cancelled",
};

const STATUS_COLOR: Record<InvoiceStatus, string> = {
  PAID: "var(--status-good)",
  OPEN: "var(--status-warning)",
  OVERDUE: "var(--status-critical)",
  DRAFT: "var(--status-muted)",
  CANCELLED: "var(--status-muted)",
};

export function StatusBreakdownChart({ data }: { data: StatusBreakdown[] }) {
  const byStatus = new Map(data.map((d) => [d.status, d]));
  const chartData = STATUS_ORDER.filter((s) => byStatus.has(s))
    .map((status) => ({
      status,
      label: STATUS_LABEL[status],
      amount: byStatus.get(status)!.amount,
      count: byStatus.get(status)!.count,
    }))
    .reverse();

  return (
    <div
      className="rounded-xl border p-5"
      style={{ borderColor: "var(--border)", background: "var(--surface-1)" }}
    >
      <h2 className="text-sm font-medium mb-4" style={{ color: "var(--text-primary)" }}>
        Invoices by status
      </h2>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 48 }}>
          <CartesianGrid horizontal={false} stroke="var(--gridline)" />
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="label"
            tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={80}
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
            formatter={(value, _name, item) => [
              `${formatCurrencyCompact(Number(value))} · ${item.payload.count} invoice(s)`,
              "Amount",
            ]}
          />
          <Bar dataKey="amount" radius={[0, 4, 4, 0]} maxBarSize={20} label={renderEndLabel}>
            {chartData.map((entry) => (
              <Cell key={entry.status} fill={STATUS_COLOR[entry.status]} />
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
    <text x={x + width + 6} y={y + height / 2} dy={4} fontSize={12} fill="var(--text-secondary)">
      {formatCurrencyCompact(value)}
    </text>
  );
}
