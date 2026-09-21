import { prisma } from "@/lib/db/prisma";
import { AutomationTile } from "@/components/AutomationTile";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const bills = await prisma.bill.findMany({
    orderBy: { date: "desc" },
  });

  return (
    <main className="flex-1 mx-auto w-full max-w-5xl px-6 py-10 space-y-8">
      <header>
        <h1 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
          Dashboard
        </h1>
      </header>

      <section className="mb-6">
        <AutomationTile />
      </section>

      <table className="w-full text-sm border-collapse">
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border)" }}>
            <th className="text-left py-2 px-2">Date</th>
            <th className="text-left py-2 px-2">Invoice #</th>
            <th className="text-left py-2 px-2">Client</th>
            <th className="text-left py-2 px-2">Direction</th>
            <th className="text-right py-2 px-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {bills.map((bill) => (
            <tr key={bill.id} style={{ borderBottom: "1px solid var(--border)" }}>
              <td className="py-2 px-2">{bill.date.toLocaleDateString("en-GB")}</td>
              <td className="py-2 px-2">{bill.invoiceNumber}</td>
              <td className="py-2 px-2">{bill.client}</td>
              <td className="py-2 px-2">{bill.direction}</td>
              <td className="py-2 px-2 text-right">
                {bill.total.toString()} {bill.currency}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
