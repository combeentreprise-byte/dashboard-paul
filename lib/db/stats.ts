import { InvoiceStatus } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

export type Totals = {
  invoiced: number;
  paid: number;
  outstanding: number;
  overdue: number;
};

export type MonthlyRevenue = {
  month: string; // "YYYY-MM"
  invoiced: number;
  paid: number;
};

export type CustomerTotal = {
  customerName: string;
  invoiced: number;
};

export type StatusBreakdown = {
  status: InvoiceStatus;
  count: number;
  amount: number;
};

export async function getTotals(): Promise<Totals> {
  const invoices = await prisma.invoice.findMany({
    select: { amountTotal: true, amountPaid: true, status: true },
  });

  let invoiced = 0;
  let paid = 0;
  let overdue = 0;

  for (const inv of invoices) {
    const total = Number(inv.amountTotal);
    const paidAmount = Number(inv.amountPaid);
    invoiced += total;
    paid += paidAmount;
    if (inv.status === InvoiceStatus.OVERDUE) {
      overdue += total - paidAmount;
    }
  }

  return { invoiced, paid, outstanding: invoiced - paid, overdue };
}

export async function getMonthlyRevenue(months = 12): Promise<MonthlyRevenue[]> {
  const since = new Date();
  since.setMonth(since.getMonth() - months + 1);
  since.setDate(1);
  since.setHours(0, 0, 0, 0);

  const invoices = await prisma.invoice.findMany({
    where: { issueDate: { gte: since } },
    select: { issueDate: true, amountTotal: true, amountPaid: true },
  });

  const byMonth = new Map<string, { invoiced: number; paid: number }>();
  for (const inv of invoices) {
    const key = `${inv.issueDate.getFullYear()}-${String(inv.issueDate.getMonth() + 1).padStart(2, "0")}`;
    const entry = byMonth.get(key) ?? { invoiced: 0, paid: 0 };
    entry.invoiced += Number(inv.amountTotal);
    entry.paid += Number(inv.amountPaid);
    byMonth.set(key, entry);
  }

  const result: MonthlyRevenue[] = [];
  const cursor = new Date(since);
  for (let i = 0; i < months; i++) {
    const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}`;
    const entry = byMonth.get(key) ?? { invoiced: 0, paid: 0 };
    result.push({ month: key, ...entry });
    cursor.setMonth(cursor.getMonth() + 1);
  }

  return result;
}

export async function getTopCustomers(limit = 5): Promise<CustomerTotal[]> {
  const invoices = await prisma.invoice.findMany({
    select: { customerName: true, amountTotal: true },
  });

  const byCustomer = new Map<string, number>();
  for (const inv of invoices) {
    byCustomer.set(inv.customerName, (byCustomer.get(inv.customerName) ?? 0) + Number(inv.amountTotal));
  }

  return [...byCustomer.entries()]
    .map(([customerName, invoiced]) => ({ customerName, invoiced }))
    .sort((a, b) => b.invoiced - a.invoiced)
    .slice(0, limit);
}

export async function getStatusBreakdown(): Promise<StatusBreakdown[]> {
  const invoices = await prisma.invoice.findMany({
    select: { status: true, amountTotal: true },
  });

  const byStatus = new Map<InvoiceStatus, { count: number; amount: number }>();
  for (const inv of invoices) {
    const entry = byStatus.get(inv.status) ?? { count: 0, amount: 0 };
    entry.count += 1;
    entry.amount += Number(inv.amountTotal);
    byStatus.set(inv.status, entry);
  }

  return [...byStatus.entries()].map(([status, v]) => ({ status, ...v }));
}

export async function getLastSyncedAt(): Promise<Date | null> {
  const latest = await prisma.invoice.findFirst({
    orderBy: { syncedAt: "desc" },
    select: { syncedAt: true },
  });
  return latest?.syncedAt ?? null;
}
