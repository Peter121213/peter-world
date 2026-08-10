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
  id: number | string
  title: string
  artist: string
  audioUrl: string
  coverUrl?: string
  lyrics?: string
  duration?: number
}

export interface SiteSettings {
  // 基本设置
  siteName: string
  siteDescription: string
  navHome: string
  navAlbum: string
  navBlog: string
  navAbout: string
  navContact: string
  footerCopyright: string
  visitCount: string
  /** 近 7 天每日访问量，key 为 YYYY-MM-DD */
  visitDaily: Record<string, number>

  // 首页 - Hero
  heroBadge: string
  heroTitle: string
  heroSubtitle: string
  heroButton1: string
  heroButton2: string
  heroImage: string

  // 首页 - 精选照片
  featuredPhotosBadge: string
  featuredPhotosTitle: string
  featuredPhotosDesc: string
  featuredPhotosViewAll: string

  // 首页 - 最近随笔
  recentPostsBadge: string
  recentPostsTitle: string
  recentPostsDesc: string
  recentPostsViewAll: string

  // 首页 - 音乐
  musicBadge: string
  musicSectionTitle: string
  musicSectionDescription: string
  musicButton: string

  // 首页 - 关于我预览
  aboutTitle: string
  aboutContent: string
  aboutImage: string
  aboutPreviewButton: string

  // 相册页面
  albumBadge: string
  albumTitle: string
  albumDesc: string
  albumCategoryAll: string
  albumCategory1: string
  albumCategory2: string
  albumCategory3: string
  albumCategory4: string
  albumCategory5: string
  albumEmpty: string

  // 生活随笔页面
  blogBadge: string
  blogTitle: string
  blogDesc: string
  blogEmpty: string

  // 关于我页面
  aboutBadge: string
  aboutPageDesc: string
  aboutLocation: string
  aboutLove: string
  aboutButton: string
  aboutPageImage: string

  // 关于我页面 - 健身
  fitnessBadge: string
  fitnessTitle: string
  fitnessDesc: string
  fitnessTag1: string
  fitnessTag2: string
  fitnessTag3: string
  fitnessTag4: string
  fitnessTag5: string
  fitnessPhotosPlaceholder: string

  // 关于我页面 - 兴趣爱好
  hobbiesTitle: string
  hobby1: string
  hobby2: string
  hobby3: string
  hobby4: string
  hobby5: string
  hobby6: string

  // 联系页面
  contactBadge: string
  contactTitle: string
  contactDesc: string
  contactEmail: string
  contactTip: string
  contactNamePlaceholder: string
  contactEmailPlaceholder: string
  contactMessagePlaceholder: string
  contactButton: string
  contactSuccess: string

  // 社交链接
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
