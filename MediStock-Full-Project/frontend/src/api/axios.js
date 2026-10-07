import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'
export const ACCESS_TOKEN_KEY = 'accessToken'
export const REFRESH_TOKEN_KEY = 'refreshToken'

const api = axios.create({
  baseURL: BASE_URL,
})

// Attach the JWT access token to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// On 401, try a silent refresh once, then fall back to logging out.
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((request) => {
    if (error) request.reject(error)
    else request.resolve(token)
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          originalRequest.headers.Authorization = 'Bearer ' + token
          return api(originalRequest)
        })
      }

      isRefreshing = true
      try {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
        if (!refreshToken) throw new Error('No refresh token')
        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken })
        localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken)
        localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken)
        processQueue(null, data.accessToken)
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError)
        localStorage.removeItem(ACCESS_TOKEN_KEY)
        localStorage.removeItem(REFRESH_TOKEN_KEY)
        localStorage.removeItem('user')
        localStorage.removeItem('medistock_user')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(error)
  }
)

export default api
