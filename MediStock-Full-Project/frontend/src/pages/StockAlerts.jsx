import { useMemo, useState } from "react";
import { PackageSearch, PackageX, PackageMinus } from "lucide-react";
import { useData } from "../context/DataContext";
import { stockStatus, currency } from "../utils/format";
import StatusPill from "../components/ui/StatusPill";
import StatCard from "../components/ui/StatCard";
import EmptyState from "../components/ui/EmptyState";

export default function StockAlerts() {
  const { medicines, supplierName } = useData();
  const [tab, setTab] = useState("all");

  const grouped = useMemo(() => {
    const low = medicines.filter((m) => stockStatus(m.quantity, m.reorderLevel).key === "warning");
    const out = medicines.filter((m) => stockStatus(m.quantity, m.reorderLevel).key === "critical");
    return { low, out, all: [...out, ...low] };
  }, [medicines]);

  const rows = grouped[tab];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard label="Out of stock" value={grouped.out.length} icon={PackageX} tone="crit" />
        <StatCard label="Low stock" value={grouped.low.length} icon={PackageMinus} tone="amber" />
        <StatCard label="Total flagged" value={grouped.all.length} icon={PackageSearch} />
      </div>

      <div className="flex gap-1 border-b border-line">
        {[
          { key: "all", label: `All (${grouped.all.length})` },
          { key: "out", label: `Out of stock (${grouped.out.length})` },
          { key: "low", label: `Low stock (${grouped.low.length})` },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`focus-ring -mb-px border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
              tab === t.key ? "border-primary text-primary" : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg border border-line bg-surface shadow-card">
        {rows.length === 0 ? (
          <EmptyState icon={PackageSearch} title="Nothing to flag here" message="Stock levels in this view are healthy." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-bg text-xs text-muted">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Medicine</th>
                  <th className="px-4 py-2.5 font-medium">Supplier</th>
                  <th className="px-4 py-2.5 font-medium">On hand</th>
                  <th className="px-4 py-2.5 font-medium">Reorder level</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                  <th className="px-4 py-2.5 font-medium">Est. reorder cost</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((m) => {
                  const status = stockStatus(m.quantity, m.reorderLevel);
                  const deficit = Math.max(m.reorderLevel * 2 - m.quantity, 0);
                  return (
                    <tr key={m.id} className="border-t border-line hover:bg-bg/60">
                      <td className="px-4 py-3">
                        <p className="font-medium text-ink">{m.name}</p>
                        <p className="font-mono text-xs text-muted">{m.batchNumber}</p>
                      </td>
                      <td className="px-4 py-3 text-muted">{supplierName(m.supplierId)}</td>
                      <td className="px-4 py-3 font-mono text-ink">{m.quantity}</td>
                      <td className="px-4 py-3 font-mono text-muted">{m.reorderLevel}</td>
                      <td className="px-4 py-3">
                        <StatusPill status={status.key} label={status.label} />
                      </td>
                      <td className="px-4 py-3 font-mono text-ink">{currency(deficit * m.price)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
