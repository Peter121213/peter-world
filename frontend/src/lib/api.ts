// 浠庣幆澧冨彉閲忚幏鍙?API 鍦板潃锛屽紑鍙戠幆澧冪敤鐩稿璺緞锛堣蛋浠ｇ悊锛夛紝鐢熶骇鐜鐢ㄥ畬鏁村湴鍧€
const API_BASE = import.meta.env.VITE_API_URL || '/api'

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

// 鐓х墖鐩稿叧 API
export const photosApi = {
  getAll: () => request<{ photos: Photo[] }>('/photos'),
  getFeatured: () => request<{ photos: Photo[] }>('/photos/featured'),
  getByCategory: (category: string) => request<{ photos: Photo[] }>(`/photos?category=${encodeURIComponent(category)}`),
  upload: async (formData: FormData) => {
    const res = await fetch(`${API_BASE}/photos`, {
      method: 'POST',
      body: formData,
      headers: {
        'X-Auth-Token': localStorage.getItem('admin_token') || '',
      },
    })
    
    const data = await res.json()
    
    if (!res.ok) {
      throw new Error(data.error || '涓婁紶澶辫触')
    }
    
    return data
  },
  delete: (id: number) =>
    request(`/photos/${id}`, {
      method: 'DELETE',
      headers: {
        'X-Auth-Token': localStorage.getItem('admin_token') || '',
      },
    }),
  update: (id: number, data: Partial<Photo>) =>
    request(`/photos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'X-Auth-Token': localStorage.getItem('admin_token') || '',
      },
    }),
}

// 闊充箰鐩稿叧 API
export const musicApi = {
  getAll: () => request<{ tracks: MusicTrack[] }>('/music'),
  upload: async (formData: FormData) => {
    const res = await fetch(`${API_BASE}/music`, {
      method: 'POST',
      body: formData,
      headers: {
        'X-Auth-Token': localStorage.getItem('admin_token') || '',
      },
    })
    
    const data = await res.json()
    
    if (!res.ok) {
      throw new Error(data.error || '涓婁紶澶辫触')
    }
    
    return data
  },
  delete: (id: number) =>
    request(`/music/${id}`, {
      method: 'DELETE',
      headers: {
        'X-Auth-Token': localStorage.getItem('admin_token') || '',
      },
    }),
}

// 璁剧疆鐩稿叧 API
export const settingsApi = {
  get: () => request<{ settings: SiteSettings }>('/settings'),
  update: (data: Partial<SiteSettings>) =>
    request('/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'X-Auth-Token': localStorage.getItem('admin_token') || '',
      },
    }),
}

// 璁よ瘉鐩稿叧 API
export const authApi = {
  login: (username: string, password: string) =>
    request<{ token: string; user: AdminUser }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  verify: () =>
    request<{ valid: boolean }>('/auth/verify', {
      headers: {
        'X-Auth-Token': localStorage.getItem('admin_token') || '',
      },
    }),
  changePassword: (oldPassword: string, newPassword: string) =>
    request<{ message: string }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ oldPassword, newPassword }),
      headers: {
        'X-Auth-Token': localStorage.getItem('admin_token') || '',
      },
    }),
}>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  verify: () =>
    request<{ valid: boolean }>('/auth/verify', {
      headers: {
        'X-Auth-Token': localStorage.getItem('admin_token') || '',
      },
    }),
}

// 鑱旂郴琛ㄥ崟 API
export const contactApi = {
  submit: (data: { name: string; email: string; message: string }) =>
    request('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getAll: () =>
    request<{ messages: ContactMessage[] }>('/contact/messages', {
      headers: {
        'X-Auth-Token': localStorage.getItem('admin_token') || '',
      },
    }),
}

import type { Photo, MusicTrack, SiteSettings, ContactMessage, AdminUser } from '../types'

