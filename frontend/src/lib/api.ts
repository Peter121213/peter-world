// 从环境变量获取 API 地址，开发环境用相对路径（走代理），生产环境用完整地址
const API_BASE = import.meta.env.VITE_API_URL || '/api'

function getToken() {
  return localStorage.getItem('admin_token') || ''
}

/** 把 token 挂到 query，避免部分网络环境改写/丢弃自定义请求头 */
function withAuthQuery(path: string) {
  const token = getToken()
  if (!token) return path
  const sep = path.includes('?') ? '&' : '?'
  return `${path}${sep}token=${encodeURIComponent(token)}`
}

function authHeaders(extra: Record<string, string> = {}) {
  const token = getToken()
  return {
    ...(token ? { 'X-Auth-Token': token, Authorization: `Bearer ${token}` } : {}),
    ...extra,
  }
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...(options?.headers || {}),
  } as Record<string, string>

  // 写操作自动附带鉴权头 + query token
  const method = (options?.method || 'GET').toUpperCase()
  const needsAuth = method !== 'GET' || headers['X-Auth-Token'] || headers['Authorization']
  const finalUrl = needsAuth && getToken() ? withAuthQuery(url) : url

  if (needsAuth && getToken()) {
    Object.assign(headers, authHeaders())
  }

  const response = await fetch(`${API_BASE}${finalUrl}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    let message = `HTTP error! status: ${response.status}`
    try {
      const data = await response.json()
      if (data?.error) message = data.error
    } catch {
      // ignore
    }
    throw new Error(message)
  }

  return response.json()
}

// 照片相关 API
export const photosApi = {
  getAll: () => request<{ photos: Photo[] }>('/photos'),
  getFeatured: () => request<{ photos: Photo[] }>('/photos/featured'),
  getByCategory: (category: string) =>
    request<{ photos: Photo[] }>(`/photos?category=${encodeURIComponent(category)}`),
  upload: async (formData: FormData) => {
    const token = getToken()
    if (token) formData.append('token', token)
    const res = await fetch(`${API_BASE}${withAuthQuery('/photos')}`, {
      method: 'POST',
      body: formData,
      headers: authHeaders(),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || '上传失败')
    return data
  },
  delete: (id: number) =>
    request(`/photos/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    }),
  update: (id: number, data: Partial<Photo>) =>
    request(`/photos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: authHeaders(),
    }),
  reorder: (photos: any[]) =>
    request('/photos', {
      method: 'PUT',
      body: JSON.stringify({ photos }),
      headers: authHeaders(),
    }),
}

// 音乐相关 API
export const musicApi = {
  getAll: () => request<{ tracks: MusicTrack[] }>('/music'),
  getById: (id: string | number) =>
    request<{ track: any }>(`/music?id=${encodeURIComponent(String(id))}`),
  upload: async (formData: FormData) => {
    const token = getToken()
    if (token) formData.append('token', token)
    const res = await fetch(`${API_BASE}${withAuthQuery('/music')}`, {
      method: 'POST',
      body: formData,
      headers: authHeaders(),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || '上传失败')
    return data
  },
  update: async (
    id: string | number,
    data: { title?: string; artist?: string; lyrics?: string } | FormData
  ) => {
    const isForm = data instanceof FormData
    const token = getToken()
    if (isForm && token) {
      data.append('token', token)
    }

    // 直接打到 /music?id=，避免走 detail 重写
    const path = withAuthQuery(`/music?id=${encodeURIComponent(String(id))}`)
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'PUT',
      body: isForm ? data : JSON.stringify({ ...(data as object), token }),
      headers: authHeaders(isForm ? {} : { 'Content-Type': 'application/json' }),
    })
    const result = await res.json()
    if (!res.ok) {
      throw new Error(result.error || '更新失败')
    }
    return result
  },
  delete: (id: number | string) =>
    request(`/music?id=${encodeURIComponent(String(id))}`, {
      method: 'DELETE',
      headers: authHeaders(),
    }),
  reorder: (tracks: any[]) =>
    request('/music', {
      method: 'PUT',
      body: JSON.stringify({ tracks, token: getToken() }),
      headers: authHeaders(),
    }),
}

// 设置相关 API
export const settingsApi = {
  get: () => request<{ settings: SiteSettings }>('/settings'),
  update: (data: Partial<SiteSettings>) =>
    request('/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: authHeaders(),
    }),
  recordVisit: () =>
    request('/settings?action=visit', {
      method: 'POST',
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
      headers: authHeaders(),
    }),
  changePassword: (oldPassword: string, newPassword: string) =>
    request('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ oldPassword, newPassword, token: getToken() }),
      headers: authHeaders(),
    }),
}

// 生活随笔 API
export const blogApi = {
  getAll: () => request<{ posts: BlogPost[] }>('/blog'),
  getRecent: (limit: number = 2) =>
    request<{ posts: BlogPost[] }>(`/blog?limit=${limit}`),
  getById: (id: string) => request<{ post: BlogPost }>(`/blog/${id}`),
  create: async (formData: FormData) => {
    const token = getToken()
    if (token) formData.append('token', token)
    const res = await fetch(`${API_BASE}${withAuthQuery('/blog')}`, {
      method: 'POST',
      body: formData,
      headers: authHeaders(),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || '创建失败')
    return data
  },
  update: async (id: string, formData: FormData) => {
    const token = getToken()
    if (token) formData.append('token', token)
    const res = await fetch(`${API_BASE}${withAuthQuery(`/blog/${id}`)}`, {
      method: 'PUT',
      body: formData,
      headers: authHeaders(),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || '更新失败')
    return data
  },
  delete: (id: string) =>
    request(`/blog/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
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
      headers: authHeaders(),
    }),
}

import type { Photo, MusicTrack, SiteSettings, ContactMessage, AdminUser, BlogPost } from '../types'
