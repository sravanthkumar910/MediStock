import { useEffect, useState } from 'react'
import { CategoryAPI } from '../api/endpoints'
import { useAuth } from '../context/AuthContext'

export default function Categories() {
  const { hasRole } = useAuth()
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({ name: '', description: '' })
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await CategoryAPI.list()
      setCategories(Array.isArray(data) ? data : data?.content || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load categories.')
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
    }

    if (!payload.name) {
      setError('Category name is required.')
      return
    }

    setError('')
    setSaving(true)
    try {
      if (editingId) {
        await CategoryAPI.update(editingId, payload)
      } else {
        await CategoryAPI.create(payload)
      }
      setForm({ name: '', description: '' })
      setEditingId(null)
      await load()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save category.')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (c) => {
    setEditingId(c.id)
    setForm({ name: c.name, description: c.description || '' })
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return
    try {
      await CategoryAPI.remove(id)
      await load()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete category.')
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Categories</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white border border-gray-200 rounded-xl overflow-hidden">
          {loading ? (
            <div className="px-4 py-8 text-center text-gray-500">Loading categories...</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-left">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map((c) => (
                  <tr key={c.id}>
                    <td className="px-4 py-3 font-medium">{c.name}</td>
                    <td className="px-4 py-3 text-gray-500">{c.description || '-'}</td>
                    <td className="px-4 py-3 space-x-2">
                      {hasRole('ADMIN', 'PHARMACIST') && (
                        <button onClick={() => handleEdit(c)} className="text-primary-600 text-xs font-medium">Edit</button>
                      )}
                      {hasRole('ADMIN') && (
                        <button onClick={() => handleDelete(c.id)} className="text-red-600 text-xs font-medium">Delete</button>
                      )}
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr><td colSpan={3} className="px-4 py-8 text-center text-gray-400">No categories yet</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {hasRole('ADMIN', 'PHARMACIST') && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 h-fit">
            <h2 className="font-semibold mb-3">{editingId ? 'Edit Category' : 'New Category'}</h2>
            {error && <div className="mb-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-3">
              <input required placeholder="Name" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
              <textarea placeholder="Description" value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" rows={3} />
              <div className="flex gap-2">
                <button type="submit" disabled={saving} className="flex-1 bg-primary-600 text-white rounded-lg py-2 text-sm font-medium disabled:opacity-60">
                  {saving ? (editingId ? 'Updating...' : 'Saving...') : (editingId ? 'Update' : 'Add')}
                </button>
                {editingId && (
                  <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', description: '' }); setError('') }}
                    className="px-4 rounded-lg border border-gray-300 text-sm">Cancel</button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
