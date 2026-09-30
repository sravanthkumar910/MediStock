import { useEffect, useState } from 'react'
import { MedicineAPI, PurchaseOrderAPI, SupplierAPI } from '../api/endpoints'

const statusStyles = {
  PENDING: 'bg-amber-100 text-amber-700',
  ORDERED: 'bg-blue-100 text-blue-700',
  RECEIVED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
}

export default function PurchaseOrders() {
  const [data, setData] = useState({ content: [] })
  const [showForm, setShowForm] = useState(false)
  const [suppliers, setSuppliers] = useState([])
  const [medicines, setMedicines] = useState([])
  const [form, setForm] = useState({ supplierId: '', notes: '', items: [{ medicineId: '', quantity: 1, unitPrice: 0 }] })
  const [error, setError] = useState('')

  const load = () => PurchaseOrderAPI.list({ page: 0, size: 20 }).then(({ data }) => setData(data))

  useEffect(() => {
    load()
    SupplierAPI.list().then(({ data }) => setSuppliers(data))
    MedicineAPI.list({ page: 0, size: 200 }).then(({ data }) => setMedicines(data.content))
  }, [])

  const updateItem = (idx, field, value) => {
    const items = [...form.items]
    items[idx] = { ...items[idx], [field]: value }
    setForm({ ...form, items })
  }

  const addItemRow = () => setForm({ ...form, items: [...form.items, { medicineId: '', quantity: 1, unitPrice: 0 }] })
  const removeItemRow = (idx) => setForm({ ...form, items: form.items.filter((_, i) => i !== idx) })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const payload = {
        supplierId: form.supplierId,
        notes: form.notes,
        items: form.items.map((it) => ({
          medicineId: it.medicineId,
          quantity: Number(it.quantity),
          unitPrice: Number(it.unitPrice),
        })),
      }
      await PurchaseOrderAPI.create(payload)
      setShowForm(false)
      setForm({ supplierId: '', notes: '', items: [{ medicineId: '', quantity: 1, unitPrice: 0 }] })
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create purchase order')
    }
  }

  const handleReceive = async (id) => {
    if (!confirm('Mark this order as received? This will add the ordered quantities to stock.')) return
    await PurchaseOrderAPI.receive(id)
    load()
  }

  const handleCancel = async (id) => {
    if (!confirm('Cancel this purchase order?')) return
    await PurchaseOrderAPI.updateStatus(id, 'CANCELLED')
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Purchase Orders</h1>
        <button onClick={() => setShowForm(true)} className="bg-primary-600 hover:bg-primary-700 text-white rounded-lg px-4 py-2 text-sm font-medium">
          + New Purchase Order
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th className="px-4 py-3">Order #</th>
              <th className="px-4 py-3">Supplier</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.content.map((po) => (
              <tr key={po.id}>
                <td className="px-4 py-3 font-medium">{po.orderNumber}</td>
                <td className="px-4 py-3">{po.supplier?.name}</td>
                <td className="px-4 py-3">{po.items?.length || 0}</td>
                <td className="px-4 py-3">₹{Number(po.totalAmount).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[po.status]}`}>{po.status}</span>
                </td>
                <td className="px-4 py-3 space-x-2">
                  {po.status !== 'RECEIVED' && po.status !== 'CANCELLED' && (
                    <>
                      <button onClick={() => handleReceive(po.id)} className="text-green-600 text-xs font-medium">Receive</button>
                      <button onClick={() => handleCancel(po.id)} className="text-red-600 text-xs font-medium">Cancel</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {data.content.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No purchase orders yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">New Purchase Order</h2>
            {error && <div className="mb-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-600">Supplier</label>
                <select required value={form.supplierId} onChange={(e) => setForm({ ...form, supplierId: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
                  <option value="">Select a supplier</option>
                  {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 mb-2 block">Items</label>
                {form.items.map((item, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <select required value={item.medicineId} onChange={(e) => updateItem(idx, 'medicineId', e.target.value)}
                      className="flex-1 rounded-lg border border-gray-300 px-2 py-2 text-sm">
                      <option value="">Medicine</option>
                      {medicines.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>
                    <input type="number" min="1" required placeholder="Qty" value={item.quantity}
                      onChange={(e) => updateItem(idx, 'quantity', e.target.value)}
                      className="w-20 rounded-lg border border-gray-300 px-2 py-2 text-sm" />
                    <input type="number" min="0" step="0.01" required placeholder="Unit Price" value={item.unitPrice}
                      onChange={(e) => updateItem(idx, 'unitPrice', e.target.value)}
                      className="w-28 rounded-lg border border-gray-300 px-2 py-2 text-sm" />
                    {form.items.length > 1 && (
                      <button type="button" onClick={() => removeItemRow(idx)} className="text-red-600 text-xs px-2">✕</button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addItemRow} className="text-primary-600 text-xs font-medium">+ Add item</button>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600">Notes</label>
                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" rows={2} />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg text-sm border border-gray-300">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg text-sm bg-primary-600 text-white">Create Order</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
