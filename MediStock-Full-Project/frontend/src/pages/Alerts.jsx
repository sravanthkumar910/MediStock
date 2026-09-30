import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import Badge from '../components/Badge'
import { MedicineAPI } from '../api/endpoints'

export default function Alerts() {
  const [tab, setTab] = useState('lowStock')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const loaders = {
    lowStock: MedicineAPI.lowStock,
    outOfStock: MedicineAPI.outOfStock,
    nearExpiry: MedicineAPI.nearExpiry,
    expired: MedicineAPI.expired,
  }

  const labels = {
    lowStock: 'Low Stock',
    outOfStock: 'Out of Stock',
    nearExpiry: 'Near Expiry',
    expired: 'Expired',
  }

  useEffect(() => {
    setLoading(true)
    loaders[tab]().then(({ data }) => setItems(data)).finally(() => setLoading(false))
  }, [tab])

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">Alerts</h1>

      <div className="flex gap-2 mb-4">
        {Object.keys(labels).map((key) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === key ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>
            {labels[key]}
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Batch</th>
              <th className="px-4 py-3">Quantity</th>
              <th className="px-4 py-3">Expiry Date</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Expiry</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((m) => (
              <tr key={m.id}>
                <td className="px-4 py-3 font-medium">{m.name}</td>
                <td className="px-4 py-3 text-gray-500">{m.batchNumber}</td>
                <td className="px-4 py-3">{m.quantity} {m.unit}</td>
                <td className="px-4 py-3">{m.expiryDate}</td>
                <td className="px-4 py-3"><Badge status={m.stockStatus} /></td>
                <td className="px-4 py-3"><Badge status={m.expiryStatus} /></td>
              </tr>
            ))}
            {!loading && items.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Nothing here 🎉</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}
