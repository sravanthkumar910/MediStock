import { useState } from 'react'
import { MedicineAPI } from '../api/endpoints'
import { useAuth } from '../context/AuthContext'

export default function StockAdjustModal({ medicine, onClose, onSaved }) {
  const { hasRole } = useAuth()
  const canAdjust = hasRole('ADMIN', 'PHARMACIST')
  const [movementType, setMovementType] = useState('STOCK_IN')
  const [quantity, setQuantity] = useState(1)
  const [remarks, setRemarks] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      await MedicineAPI.adjustStock(medicine.id, { movementType, quantity: Number(quantity), remarks })
      onSaved()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update stock')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm p-6">
        <h2 className="text-lg font-bold mb-1">Adjust Stock</h2>
        <p className="text-sm text-gray-500 mb-4">{medicine.name} — currently {medicine.quantity} {medicine.unit}</p>

        {error && <div className="mb-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-600">Movement Type</label>
            <select value={movementType} onChange={(e) => setMovementType(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
              <option value="STOCK_OUT">Stock Out (remove)</option>
              {canAdjust && <option value="STOCK_IN">Stock In (add)</option>}
              {canAdjust && <option value="ADJUSTMENT">Set Absolute Quantity</option>}
              {canAdjust && <option value="EXPIRED_REMOVAL">Remove Expired Stock</option>}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">Quantity</label>
            <input type="number" min="0" required value={quantity} onChange={(e) => setQuantity(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">Remarks</label>
            <input value={remarks} onChange={(e) => setRemarks(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="Optional note" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm border border-gray-300">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg text-sm bg-primary-600 text-white disabled:opacity-60">
              {saving ? 'Saving...' : 'Update Stock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
