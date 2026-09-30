import { useMemo, useState } from "react";
import { CalendarClock } from "lucide-react";
import { useData } from "../context/DataContext";
import { expiryStatus, formatDate } from "../utils/format";
import EmptyState from "../components/ui/EmptyState";

const BAR_COLORS = { ok: "#2F8F5B", warning: "#D98C2B", critical: "#C4433B", expired: "#8A2E29" };
const HORIZON_DAYS = 180;

export default function ExpiryTracking() {
  const { medicines, supplierName } = useData();
  const [filter, setFilter] = useState("all");

  const rows = useMemo(() => {
    const sorted = [...medicines].sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));
    if (filter === "all") return sorted;
    return sorted.filter((m) => expiryStatus(m.expiryDate).key === filter);
  }, [medicines, filter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-base font-semibold text-ink">Expiry tracking</h2>
          <p className="text-sm text-muted">
            Batch position on a {HORIZON_DAYS}-day shelf-life scale — the strip fills as expiry approaches.
          </p>
        </div>
        <div className="flex gap-1 rounded border border-line bg-surface p-1">
          {[
            { key: "all", label: "All" },
            { key: "ok", label: "Healthy" },
            { key: "warning", label: "Near expiry" },
            { key: "critical", label: "Critical" },
            { key: "expired", label: "Expired" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className={`focus-ring rounded px-2.5 py-1.5 text-xs font-medium transition-colors ${
                filter === t.key ? "bg-primary-light text-primary" : "text-muted hover:bg-bg"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-line bg-surface shadow-card">
        {rows.length === 0 ? (
          <EmptyState icon={CalendarClock} title="No batches in this window" />
        ) : (
          <ul className="divide-y divide-line">
            {rows.map((m) => {
              const status = expiryStatus(m.expiryDate);
              const pct = Math.max(0, Math.min(100, 100 - (status.days / HORIZON_DAYS) * 100));
              const color = BAR_COLORS[status.key];
              return (
                <li key={m.id} className="flex flex-col gap-2 px-4 py-3.5 sm:flex-row sm:items-center sm:gap-4">
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    {/* signature: color-coded batch strip, like a lab specimen label */}
                    <span
                      className="h-9 w-1.5 shrink-0 rounded-full"
                      style={{ background: color }}
                      aria-hidden="true"
                    />
                    <div className="min-w-0">
                      <p className="truncate font-medium text-ink">{m.name}</p>
                      <p className="truncate font-mono text-xs text-muted">
                        {m.batchNumber} · {supplierName(m.supplierId)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-1 items-center gap-3 sm:max-w-xs">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-bg">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, background: color }}
                      />
                    </div>
                    <span className="w-20 shrink-0 text-right font-mono text-xs" style={{ color }}>
                      {status.key === "expired" ? "Expired" : status.label}
                    </span>
                  </div>

                  <div className="shrink-0 text-right text-xs text-muted sm:w-28">{formatDate(m.expiryDate)}</div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
