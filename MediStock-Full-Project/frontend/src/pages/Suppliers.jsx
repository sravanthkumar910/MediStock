import { useState } from "react";
import { Plus, Pencil, Trash2, Mail, Phone, MapPin, Truck } from "lucide-react";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import { formatDate } from "../utils/format";
import EmptyState from "../components/ui/EmptyState";
import SupplierForm from "./SupplierForm";

export default function Suppliers() {
  const { suppliers, deleteSupplier, medicines } = useData();
  const { user } = useAuth();
  const canEdit = user?.role === "Admin" || user?.role === "Pharmacist";

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (s) => {
    setEditing(s);
    setFormOpen(true);
  };

  const supplyCount = (id) => medicines.filter((m) => m.supplierId === id).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-base font-semibold text-ink">Suppliers</h2>
          <p className="text-sm text-muted">{suppliers.length} registered suppliers</p>
        </div>
        {canEdit && (
          <button
            onClick={openAdd}
            className="focus-ring flex items-center gap-1.5 rounded bg-primary px-3.5 py-2 text-sm font-medium text-white hover:bg-primary-dark"
          >
            <Plus size={15} /> Add supplier
          </button>
        )}
      </div>

      {suppliers.length === 0 ? (
        <EmptyState icon={Truck} title="No suppliers yet" message="Add a supplier to start linking medicine batches." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {suppliers.map((s) => (
            <div key={s.id} className="rounded-lg border border-line bg-surface p-4 shadow-card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono text-[11px] text-muted">{s.id}</p>
                  <h3 className="mt-0.5 font-display text-sm font-semibold text-ink">{s.name}</h3>
                </div>
                {canEdit && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEdit(s)}
                      className="focus-ring grid h-7 w-7 place-items-center rounded text-muted hover:bg-primary-light hover:text-primary"
                      aria-label={`Edit ${s.name}`}
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => deleteSupplier(s.id)}
                      className="focus-ring grid h-7 w-7 place-items-center rounded text-muted hover:bg-crit-light hover:text-crit"
                      aria-label={`Delete ${s.name}`}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-3 space-y-1.5 text-xs text-muted">
                <p className="flex items-center gap-1.5">
                  <Phone size={12} /> {s.contact}
                </p>
                <p className="flex items-center gap-1.5">
                  <Mail size={12} /> {s.email}
                </p>
                <p className="flex items-center gap-1.5">
                  <MapPin size={12} /> {s.address}
                </p>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-line pt-3 text-center">
                <div>
                  <p className="font-display text-sm font-semibold text-ink">{supplyCount(s.id)}</p>
                  <p className="text-[10px] text-muted">Medicines</p>
                </div>
                <div>
                  <p className="font-display text-sm font-semibold text-ink">{s.performance}%</p>
                  <p className="text-[10px] text-muted">On-time rate</p>
                </div>
                <div>
                  <p className="font-display text-xs font-semibold text-ink">
                    {s.lastOrder === "-" ? "—" : formatDate(s.lastOrder)}
                  </p>
                  <p className="text-[10px] text-muted">Last order</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <SupplierForm open={formOpen} onClose={() => setFormOpen(false)} editing={editing} />
    </div>
  );
}
