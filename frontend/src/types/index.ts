export interface Photo {
  id: number
  title: string
  description?: string
  imageUrl: string
  category: string
  isFeatured: boolean
  createdAt: string
}

export interface MusicTrack {
  id: number
  title: string
  artist: string
  audioUrl: string
  coverUrl?: string
  duration?: number
}

export interface SiteSettings {
  siteName: string
  siteDescription: string
  heroTitle: string
  heroSubtitle: string
  heroImage: string
  aboutTitle: string
  aboutContent: string
  aboutImage: string
  aboutPageImage: string
  musicSectionTitle: string
  musicSectionDescription: string
  socialLinks: {
    weibo?: string
    instagram?: string
    x?: string
    github?: string
    email?: string
  }
}

export interface BlogPost {
  id: string
  title: string
  content: string
  coverImage?: string
  createdAt: string
  updatedAt: string
}

export interface ContactMessage {
  id: number
  name: string
  email: string
  message: string
  createdAt: string
}

export interface AdminUser {
  username: string
  token: string
}
