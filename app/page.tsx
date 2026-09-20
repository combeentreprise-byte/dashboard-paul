import { getLastSyncedAt, getMonthlyRevenue, getStatusBreakdown, getTopCustomers, getTotals } from "@/lib/db/stats";
import { StatTile } from "@/components/StatTile";
import { RevenueChart } from "@/components/charts/RevenueChart";
import { TopCustomersChart } from "@/components/charts/TopCustomersChart";
import { StatusBreakdownChart } from "@/components/charts/StatusBreakdownChart";
import { formatCurrencyCompact } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [totals, monthlyRevenue, topCustomers, statusBreakdown, lastSyncedAt] = await Promise.all([
    getTotals(),
    getMonthlyRevenue(),
    getTopCustomers(),
    getStatusBreakdown(),
    getLastSyncedAt(),
  ]);

  const hasData = totals.invoiced > 0;

  return (
    <main className="flex-1 mx-auto w-full max-w-5xl px-6 py-10 space-y-8">
      <header className="flex items-end justify-between">
        <h1 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
          Revenue dashboard
        </h1>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          {lastSyncedAt
            ? `Last synced ${lastSyncedAt.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}`
            : "Not synced yet"}
        </span>
      </header>

      {!hasData ? (
        <div
          className="rounded-xl border p-8 text-sm"
          style={{ borderColor: "var(--border)", background: "var(--surface-1)", color: "var(--text-secondary)" }}
        >
          No invoices synced yet. Trigger a sync via POST /api/sync/everbill once Everbill credentials are
          configured.
        </div>
      ) : (
        <>
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatTile label="Total invoiced" value={formatCurrencyCompact(totals.invoiced)} />
            <StatTile label="Total paid" value={formatCurrencyCompact(totals.paid)} accent="good" />
            <StatTile label="Outstanding" value={formatCurrencyCompact(totals.outstanding)} />
            <StatTile label="Overdue" value={formatCurrencyCompact(totals.overdue)} accent="critical" />
          </section>

          <RevenueChart data={monthlyRevenue} />

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TopCustomersChart data={topCustomers} />
            <StatusBreakdownChart data={statusBreakdown} />
          </section>
        </>
      )}
    </main>
  );
}
