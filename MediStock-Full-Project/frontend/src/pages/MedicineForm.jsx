import { useEffect, useState } from "react";
import Modal from "../components/ui/Modal";
import { useData } from "../context/DataContext";

const EMPTY = {
  name: "",
  batchNumber: "",
  categoryId: "",
  supplierId: "",
  quantity: "",
  reorderLevel: "",
  manufacturingDate: "",
  expiryDate: "",
  price: "",
};

export default function MedicineForm({ open, onClose, editing }) {
  const { suppliers, categories, addMedicine, updateMedicine } = useData();
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editing) {
      const categoryId = editing.categoryId || categories.find((category) => category.name === editing.category)?.id || "";
      setForm({ ...editing, categoryId });
    } else {
      setForm({ ...EMPTY, categoryId: categories[0]?.id || "", supplierId: suppliers[0]?.id || "" });
    }
  }, [editing, open, suppliers, categories]);

  const update = (k) => (e) => {
    setError("");
    setForm((f) => ({ ...f, [k]: e.target.value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    const payload = {
      ...form,
      quantity: Number(form.quantity) || 0,
      reorderLevel: Number(form.reorderLevel) || 0,
      price: Number(form.price) || 0,
    };
    try {
      if (editing) await updateMedicine(editing.id, payload);
      else await addMedicine(payload);
      onClose();
    } catch (saveError) {
      setError(saveError.response?.data?.message || "Could not save medicine.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={editing ? `Edit ${editing.name}` : "Add medicine"} width="max-w-xl">
      <form onSubmit={submit} className="space-y-4">
        {error && <p role="alert" className="rounded border border-crit/30 bg-crit-light px-3 py-2 text-sm text-crit">{error}</p>}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Medicine name" full>
            <input required value={form.name} onChange={update("name")} className={inputCls} placeholder="Paracetamol 500mg" />
          </Field>
          <Field label="Batch number">
            <input required value={form.batchNumber} onChange={update("batchNumber")} className={`${inputCls} font-mono`} placeholder="PCM-2401-A" />
          </Field>
          <Field label="Category">
            <select required value={form.categoryId} onChange={update("categoryId")} className={inputCls}>
              <option value="" disabled>Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Supplier" full>
            <select required value={form.supplierId} onChange={update("supplierId")} className={inputCls}>
              <option value="" disabled>
                Select supplier
              </option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Quantity">
            <input required type="number" min="0" value={form.quantity} onChange={update("quantity")} className={inputCls} />
          </Field>
          <Field label="Reorder level">
            <input required type="number" min="0" value={form.reorderLevel} onChange={update("reorderLevel")} className={inputCls} />
          </Field>
          <Field label="Manufacturing date">
            <input required type="date" value={form.manufacturingDate} onChange={update("manufacturingDate")} className={inputCls} />
          </Field>
          <Field label="Expiry date">
            <input required type="date" value={form.expiryDate} onChange={update("expiryDate")} className={inputCls} />
          </Field>
          <Field label="Price (₹)">
            <input required type="number" min="0" step="0.01" value={form.price} onChange={update("price")} className={inputCls} />
          </Field>
        </div>

        <div className="flex justify-end gap-2 border-t border-line pt-4">
          <button type="button" onClick={onClose} className="focus-ring rounded border border-line px-4 py-2 text-sm font-medium text-ink hover:bg-bg">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="focus-ring rounded bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60">
            {saving ? "Saving..." : editing ? "Save changes" : "Add medicine"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

const inputCls =
  "focus-ring w-full rounded border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-muted";

function Field({ label, children, full }) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <label className="mb-1.5 block text-xs font-medium text-ink">{label}</label>
      {children}
    </div>
  );
}
