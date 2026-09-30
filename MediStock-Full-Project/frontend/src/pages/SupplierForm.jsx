import { useEffect, useState } from "react";
import Modal from "../components/ui/Modal";
import { useData } from "../context/DataContext";

const EMPTY = { name: "", contact: "", email: "", address: "" };

export default function SupplierForm({ open, onClose, editing }) {
  const { addSupplier, updateSupplier } = useData();
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    setForm(editing || EMPTY);
  }, [editing, open]);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (editing) await updateSupplier(editing.id, form);
    else await addSupplier(form);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={editing ? `Edit ${editing.name}` : "Add supplier"}>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink">Supplier name</label>
          <input required value={form.name} onChange={update("name")} className={inputCls} placeholder="Vantage Pharma Distributors" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink">Contact number</label>
          <input required value={form.contact} onChange={update("contact")} className={inputCls} placeholder="+91 98450 12233" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink">Email</label>
          <input required type="email" value={form.email} onChange={update("email")} className={inputCls} placeholder="orders@supplier.com" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink">Address</label>
          <textarea required value={form.address} onChange={update("address")} rows={2} className={inputCls} placeholder="Street, city" />
        </div>

        <div className="flex justify-end gap-2 border-t border-line pt-4">
          <button type="button" onClick={onClose} className="focus-ring rounded border border-line px-4 py-2 text-sm font-medium text-ink hover:bg-bg">
            Cancel
          </button>
          <button type="submit" className="focus-ring rounded bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark">
            {editing ? "Save changes" : "Add supplier"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

const inputCls =
  "focus-ring w-full rounded border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-muted";
