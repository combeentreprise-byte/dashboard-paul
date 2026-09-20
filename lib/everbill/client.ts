/**
 * Thin wrapper around the Everbill REST API.
 *
 * NOTE: exact endpoint paths, auth header format, and field names are not yet
 * confirmed against Everbill's real API docs. Adjust `fetchInvoicesPage` once
 * real credentials/docs are available — everything else (sync.ts, stats.ts)
 * is written against `EverbillInvoice` below, so a field-mapping fix here is
 * isolated to this file.
 */

const EVERBILL_API_URL = process.env.EVERBILL_API_URL ?? "https://api.everbill.com";
const EVERBILL_API_KEY = process.env.EVERBILL_API_KEY;

export type EverbillInvoice = {
  id: string;
  number: string;
  customerName: string;
  amountTotal: number;
  amountPaid: number;
  currency: string;
  status: string;
  issueDate: string;
  dueDate: string | null;
  paidDate: string | null;
  [key: string]: unknown;
};

type EverbillInvoicesResponse = {
  data: EverbillInvoice[];
  hasMore: boolean;
};

function assertConfigured() {
  if (!EVERBILL_API_KEY) {
    throw new Error("EVERBILL_API_KEY is not set");
  }
}

async function fetchInvoicesPage(page: number, pageSize = 100): Promise<EverbillInvoicesResponse> {
  assertConfigured();

  const url = new URL("/v1/invoices", EVERBILL_API_URL);
  url.searchParams.set("page", String(page));
  url.searchParams.set("pageSize", String(pageSize));

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${EVERBILL_API_KEY}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Everbill API error ${res.status}: ${body}`);
  }

  return res.json();
}

/** Fetches every invoice from Everbill, paginating until the API says there's no more. */
export async function fetchAllInvoices(): Promise<EverbillInvoice[]> {
  const invoices: EverbillInvoice[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await fetchInvoicesPage(page);
    invoices.push(...response.data);
    hasMore = response.hasMore;
    page += 1;
  }

  return invoices;
}
