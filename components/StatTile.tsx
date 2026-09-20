export function StatTile({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "critical" | "good";
}) {
  const accentColor =
    accent === "critical"
      ? "var(--status-critical)"
      : accent === "good"
      ? "var(--status-good)"
      : "var(--text-primary)";

  return (
    <div
      className="rounded-xl border p-5"
      style={{ borderColor: "var(--border)", background: "var(--surface-1)" }}
    >
      <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
        {label}
      </div>
      <div className="mt-2 text-3xl font-semibold" style={{ color: accentColor }}>
        {value}
      </div>
    </div>
  );
}
