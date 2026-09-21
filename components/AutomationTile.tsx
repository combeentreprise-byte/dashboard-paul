"use client";

import { useState } from "react";
import { Play, Loader2, CheckCircle2, XCircle } from "lucide-react";

export function AutomationTile() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    status: "success" | "error";
    message: string;
  } | null>(null);

  async function handleRun() {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/gemini/process", {
        method: "POST",
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Ein Fehler ist aufgetreten");
      }

      setResult({
        status: "success",
        message: data.message || "Erfolgreich verarbeitet",
      });
    } catch (err) {
      setResult({
        status: "error",
        message: err instanceof Error ? err.message : "Unbekannter Fehler",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="rounded-xl border p-5 flex flex-col justify-between"
      style={{ borderColor: "var(--border)", background: "var(--surface-1)" }}
    >
      <div>
        <h3 className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
          E-Mail Automatisierung (Gemini)
        </h3>
        <p className="mt-1 text-xs" style={{ color: "var(--text-secondary)" }}>
          Prüft den Posteingang, sortiert Rechnungen und legt sie in Google Drive ab.
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <button
          onClick={handleRun}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg py-2 px-4 text-sm font-medium transition-colors"
          style={{
            background: "linear-gradient(135deg, #4285f4, #7b5ea7)",
            color: "white",
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Verarbeite...
            </>
          ) : (
            <>
              <Play size={16} />
              Jetzt prüfen
            </>
          )}
        </button>

        {result && (
          <div
            className="flex items-start gap-2 rounded-lg p-3 text-xs"
            style={{
              background: result.status === "success" ? "rgba(12, 163, 12, 0.1)" : "rgba(208, 59, 59, 0.1)",
              color: result.status === "success" ? "var(--status-good)" : "var(--status-critical)",
            }}
          >
            {result.status === "success" ? (
              <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
            ) : (
              <XCircle size={16} className="shrink-0 mt-0.5" />
            )}
            <span>{result.message}</span>
          </div>
        )}
      </div>
    </div>
  );
}
