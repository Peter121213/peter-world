// 从环境变量获取 API 地址，开发环境用相对路径（走代理），生产环境用完整地址
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

// 照片相关 API
export const photosApi = {
  getAll: () => request<{ photos: Photo[] }>('/photos'),
  getFeatured: () => request<{ photos: Photo[] }>('/photos/featured'),
  getByCategory: (category: string) => request<{ photos: Photo[] }>(`/photos?category=${encodeURIComponent(category)}`),
  upload: async (formData: FormData) => {
    const res = await fetch(`${API_BASE}/photos`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
      },
    })
    
    const data = await res.json()
    
    if (!res.ok) {
      throw new Error(data.error || '上传失败')
    }
    
    return data
  },
  delete: (id: number) =>
    request(`/photos/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
      },
    }),
  update: (id: number, data: Partial<Photo>) =>
    request(`/photos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
      },
    }),
}

// 音乐相关 API
export const musicApi = {
  getAll: () => request<{ tracks: MusicTrack[] }>('/music'),
  upload: async (formData: FormData) => {
    const res = await fetch(`${API_BASE}/music`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
      },
    })
    
    const data = await res.json()
    
    if (!res.ok) {
      throw new Error(data.error || '上传失败')
    }
    
    return data
  },
  delete: (id: number) =>
    request(`/music/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
      },
    }),
}

// 设置相关 API
export const settingsApi = {
  get: () => request<{ settings: SiteSettings }>('/settings'),
  update: (data: Partial<SiteSettings>) =>
    request('/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
      },
    }),
}

// 认证相关 API
export const authApi = {
  login: (username: string, password: string) =>
    request<{ token: string; user: AdminUser }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  verify: () =>
    request<{ valid: boolean }>('/auth/verify', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
      },
    }),
}

// 联系表单 API
export const contactApi = {
  submit: (data: { name: string; email: string; message: string }) =>
    request('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getAll: () =>
    request<{ messages: ContactMessage[] }>('/contact/messages', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
      },
    }),
}

import type { Photo, MusicTrack, SiteSettings, ContactMessage, AdminUser } from '../types'
