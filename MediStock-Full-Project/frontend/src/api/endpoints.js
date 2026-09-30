// Central place listing every backend endpoint this frontend calls.
import api from './axios'

export const AuthAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
}

export const MedicineAPI = {
  list: (params) => api.get('/medicines', { params }),
  get: (id) => api.get(`/medicines/${id}`),
  create: (data) => api.post('/medicines', data),
  update: (id, data) => api.put(`/medicines/${id}`, data),
  remove: (id) => api.delete(`/medicines/${id}`),
  adjustStock: (id, data) => api.post(`/medicines/${id}/stock`, data),
  lowStock: () => api.get('/medicines/alerts/low-stock'),
  outOfStock: () => api.get('/medicines/alerts/out-of-stock'),
  nearExpiry: () => api.get('/medicines/alerts/near-expiry'),
  expired: () => api.get('/medicines/alerts/expired'),
}

export const CategoryAPI = {
  list: () => api.get('/categories'),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  remove: (id) => api.delete(`/categories/${id}`),
}

export const SupplierAPI = {
  list: (keyword) => api.get('/suppliers', { params: { keyword } }),
  get: (id) => api.get(`/suppliers/${id}`),
  create: (data) => api.post('/suppliers', data),
  update: (id, data) => api.put(`/suppliers/${id}`, data),
  remove: (id) => api.delete(`/suppliers/${id}`),
}

export const PurchaseOrderAPI = {
  list: (params) => api.get('/purchase-orders', { params }),
  get: (id) => api.get(`/purchase-orders/${id}`),
  create: (data) => api.post('/purchase-orders', data),
  updateStatus: (id, status) => api.patch(`/purchase-orders/${id}/status`, null, { params: { status } }),
  receive: (id) => api.post(`/purchase-orders/${id}/receive`),
}

export const DashboardAPI = {
  summary: () => api.get('/dashboard/summary'),
}

export const NotificationAPI = {
  list: (params) => api.get('/notifications', { params }),
  unreadCount: () => api.get('/notifications/unread-count'),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
  scan: () => api.post('/notifications/scan'),
}

export const ReportAPI = {
  exportInventoryCsv: () => api.get('/reports/inventory/export'),
  exportPdf: (reportType) => api.get(`/reports/${reportType}/pdf`, { responseType: 'blob' }),
}

export const UserAPI = {
  list: () => api.get('/users'),
  invite: (data) => api.post('/users/invite', data),
  updateRole: (id, role) => api.patch(`/users/${id}/role`, { role }),
  updateStatus: (id, enabled) => api.patch(`/users/${id}/status`, { enabled }),
  remove: (id) => api.delete(`/users/${id}`),
}

export const StockLogAPI = {
  history: (params) => api.get('/stock-logs', { params }),
}
