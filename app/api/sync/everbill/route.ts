import { NextRequest, NextResponse } from "next/server";
import { syncEverbillInvoices } from "@/lib/everbill/sync";

export const maxDuration = 60;

// Vercel Cron sends a GET request with `Authorization: Bearer $CRON_SECRET`
// automatically once CRON_SECRET is set as a project env var.
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await syncEverbillInvoices();
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error("Everbill sync failed", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 502 });
  }
}
