import { InvoiceStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { fetchAllInvoices, type EverbillInvoice } from "./client";

/**
 * Everbill status strings aren't confirmed yet — extend this map once real
 * values are known. Anything unrecognized falls back to OPEN rather than
 * throwing, so a sync never fails outright over one unexpected status.
 */
function mapStatus(raw: string): InvoiceStatus {
  switch (raw.toLowerCase()) {
    case "draft":
      return InvoiceStatus.DRAFT;
    case "paid":
      return InvoiceStatus.PAID;
    case "overdue":
      return InvoiceStatus.OVERDUE;
    case "cancelled":
    case "canceled":
      return InvoiceStatus.CANCELLED;
    case "open":
    case "sent":
    default:
      return InvoiceStatus.OPEN;
  }
}

function toUpsertData(invoice: EverbillInvoice) {
  return {
    number: invoice.number,
    customerName: invoice.customerName,
    amountTotal: new Prisma.Decimal(invoice.amountTotal),
    amountPaid: new Prisma.Decimal(invoice.amountPaid),
    currency: invoice.currency,
    status: mapStatus(invoice.status),
    issueDate: new Date(invoice.issueDate),
    dueDate: invoice.dueDate ? new Date(invoice.dueDate) : null,
    paidDate: invoice.paidDate ? new Date(invoice.paidDate) : null,
    raw: invoice as Prisma.InputJsonValue,
  };
}

export type SyncResult = {
  fetched: number;
  upserted: number;
};

export async function syncEverbillInvoices(): Promise<SyncResult> {
  const invoices = await fetchAllInvoices();

  for (const invoice of invoices) {
    const data = toUpsertData(invoice);
    await prisma.invoice.upsert({
      where: { everbillId: invoice.id },
      create: { everbillId: invoice.id, ...data },
      update: data,
    });
  }

  return { fetched: invoices.length, upserted: invoices.length };
}
