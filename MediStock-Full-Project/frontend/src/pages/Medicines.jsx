import { Pencil, Pill, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import EmptyState from "../components/ui/EmptyState";
import StatusPill from "../components/ui/StatusPill";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { currency, expiryStatus, formatDate, stockStatus } from "../utils/format";
import MedicineForm from "./MedicineForm";

export default function Medicines() {
  const { medicines, suppliers, categories, deleteMedicine, supplierName } = useData();
  const { user } = useAuth();
  const canEdit = user?.role === "Admin" || user?.role === "Pharmacist";
  const canDelete = user?.role === "Admin";

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [supplierFilter, setSupplierFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [actionError, setActionError] = useState("");

  const filtered = useMemo(() => {
    return medicines.filter((m) => {
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        String(m.name || "").toLowerCase().includes(q) ||
        String(m.batchNumber || "").toLowerCase().includes(q) ||
        String(m.id || "").toLowerCase().includes(q);
      const matchesCategory = category === "All" || String(m.category) === String(category);
      const matchesSupplier = supplierFilter === "All" || String(m.supplierId) === String(supplierFilter);
      const st = stockStatus(m.quantity, m.reorderLevel).key;
      const ex = expiryStatus(m.expiryDate).key;
      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Low stock" && st !== "ok") ||
        (statusFilter === "Expiring" && (ex === "warning" || ex === "critical")) ||
        (statusFilter === "Expired" && ex === "expired");
      return matchesQuery && matchesCategory && matchesSupplier && matchesStatus;
    });
  }, [medicines, query, category, supplierFilter, statusFilter]);

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (m) => {
    setEditing(m);
    setFormOpen(true);
  };

  const handleDelete = async (medicine) => {
    if (!window.confirm(`Delete ${medicine.name}?`)) return;

    setActionError("");
    try {
      await deleteMedicine(medicine.id);
    } catch (error) {
      setActionError(error.response?.data?.message || "Could not delete medicine.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-base font-semibold text-ink">Medicine inventory</h2>
          <p className="text-sm text-muted">{filtered.length} of {medicines.length} medicines</p>
        </div>
        {canEdit && (
          <button
            onClick={openAdd}
            className="focus-ring flex items-center gap-1.5 rounded bg-primary px-3.5 py-2 text-sm font-medium text-white hover:bg-primary-dark"
          >
            <Plus size={15} /> Add medicine
          </button>
        )}
      </div>

      {actionError && <p role="alert" className="rounded border border-crit/30 bg-crit-light px-3 py-2 text-sm text-crit">{actionError}</p>}

      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-line bg-surface p-3 shadow-card">
        <div className="relative min-w-[200px] flex-1">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, batch, or ID"
            className="focus-ring w-full rounded border border-line bg-bg py-2 pl-8 pr-3 text-sm text-ink placeholder:text-muted"
          />
        </div>
        <Select value={category} onChange={setCategory} options={["All", ...categories.map((item) => item.name)]} />
        <Select
          value={supplierFilter}
          onChange={setSupplierFilter}
          options={["All", ...suppliers.map((s) => s.id)]}
          labels={{ All: "All suppliers", ...Object.fromEntries(suppliers.map((s) => [s.id, s.name])) }}
        />
        <Select value={statusFilter} onChange={setStatusFilter} options={["All", "Low stock", "Expiring", "Expired"]} />
      </div>

      <div className="overflow-hidden rounded-lg border border-line bg-surface shadow-card">
        {filtered.length === 0 ? (
          <EmptyState
            icon={Pill}
            title="No medicines match these filters"
            message="Try clearing a filter or search term."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-bg text-xs text-muted">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Medicine</th>
                  <th className="px-4 py-2.5 font-medium">Batch</th>
                  <th className="px-4 py-2.5 font-medium">Category</th>
                  <th className="px-4 py-2.5 font-medium">Supplier</th>
                  <th className="px-4 py-2.5 font-medium">Quantity</th>
                  <th className="px-4 py-2.5 font-medium">Stock</th>
                  <th className="px-4 py-2.5 font-medium">Expiry</th>
                  <th className="px-4 py-2.5 font-medium">Price</th>
                  {canEdit && <th className="px-4 py-2.5 font-medium text-right">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => {
                  const stock = stockStatus(m.quantity, m.reorderLevel);
                  const exp = expiryStatus(m.expiryDate);
                  return (
                    <tr key={m.id} className="border-t border-line hover:bg-bg/60">
                      <td className="px-4 py-3">
                        <p className="font-medium text-ink">{m.name}</p>
                        <p className="text-xs text-muted">{m.id}</p>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-muted">{m.batchNumber}</td>
                      <td className="px-4 py-3 text-muted">{m.category}</td>
                      <td className="px-4 py-3 text-muted">{supplierName(m.supplierId)}</td>
                      <td className="px-4 py-3 font-mono text-ink">{m.quantity}</td>
                      <td className="px-4 py-3">
                        <StatusPill status={stock.key} label={stock.label} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <StatusPill status={exp.key} label={exp.key === "expired" ? "Expired" : exp.label} />
                          <span className="text-[11px] text-muted">{formatDate(m.expiryDate)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-ink">{currency(m.price)}</td>
                      {canEdit && (
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => openEdit(m)}
                              className="focus-ring grid h-7 w-7 place-items-center rounded text-muted hover:bg-primary-light hover:text-primary"
                              aria-label={`Edit ${m.name}`}
                            >
                              <Pencil size={14} />
                            </button>
                            {canDelete && (
                              <button
                                onClick={() => handleDelete(m)}
                                className="focus-ring grid h-7 w-7 place-items-center rounded text-muted hover:bg-crit-light hover:text-crit"
                                aria-label={`Delete ${m.name}`}
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <MedicineForm open={formOpen} onClose={() => setFormOpen(false)} editing={editing} />
    </div>
  );
}

function Select({ value, onChange, options, labels }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="focus-ring rounded border border-line bg-bg px-2.5 py-2 text-sm text-ink"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {labels?.[o] || o}
        </option>
      ))}
    </select>
  );
}
