import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Image, Filter } from 'lucide-react'
import PhotoGrid from '@/components/PhotoGrid'
import { photosApi, settingsApi } from '@/lib/api'
import { cn } from '@/lib/utils'
import type { Photo, SiteSettings } from '@/types'

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState('全部')
  const [photos, setPhotos] = useState<Photo[]>([])
  const [filteredPhotos, setFilteredPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [settingsLoading, setSettingsLoading] = useState(true)

  useEffect(() => {
    fetchPhotos()
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setSettingsLoading(true)
      const res = await settingsApi.get()
      const s: any = res.settings
      setSettings({
        siteName: s.site_name || 'Peter 的小世界',
        siteDescription: s.site_description || '',
        navHome: s.nav_home || '首页',
        navAlbum: s.nav_album || '相册',
        navBlog: s.nav_blog || '生活随笔',
        navAbout: s.nav_about || '关于我',
        navContact: s.nav_contact || '联系我',
        footerCopyright: s.footer_copyright || '',
        heroBadge: s.hero_badge || '',
        heroTitle: s.hero_title || '',
        heroSubtitle: s.hero_subtitle || '',
        heroButton1: s.hero_button1 || '',
        heroButton2: s.hero_button2 || '',
        heroImage: s.hero_image || '',
        featuredPhotosBadge: s.featured_photos_badge || '',
        featuredPhotosTitle: s.featured_photos_title || '',
        featuredPhotosDesc: s.featured_photos_desc || '',
        featuredPhotosViewAll: s.featured_photos_view_all || '',
        recentPostsBadge: s.recent_posts_badge || '',
        recentPostsTitle: s.recent_posts_title || '',
        recentPostsDesc: s.recent_posts_desc || '',
        recentPostsViewAll: s.recent_posts_view_all || '',
        musicBadge: s.music_badge || '',
        musicSectionTitle: s.music_section_title || '',
        musicSectionDescription: s.music_section_description || '',
        musicButton: s.music_button || '',
        aboutTitle: s.about_title || '',
        aboutContent: s.about_content || '',
        aboutImage: s.about_image || '',
        aboutPreviewButton: s.about_preview_button || '',
        albumBadge: s.album_badge || 'Album',
        albumTitle: s.album_title || '相册',
        albumDesc: s.album_desc || '随手拍的一些照片，记录生活中的点点滴滴\n随便看看吧～',
        albumCategoryAll: s.album_category_all || '全部',
        albumCategory1: s.album_category_1 || '风景',
        albumCategory2: s.album_category_2 || '人像',
        albumCategory3: s.album_category_3 || '美食',
        albumCategory4: s.album_category_4 || '小动物',
        albumCategory5: s.album_category_5 || '其他',
        albumEmpty: s.album_empty || '还没有照片～',
        blogBadge: s.blog_badge || '',
        blogTitle: s.blog_title || '',
        blogDesc: s.blog_desc || '',
        blogEmpty: s.blog_empty || '',
        aboutBadge: s.about_badge || '',
        aboutPageDesc: s.about_page_desc || '',
        aboutLocation: s.about_location || '',
        aboutLove: s.about_love || '',
        aboutButton: s.about_button || '',
        aboutPageImage: s.about_page_image || '',
        fitnessBadge: s.fitness_badge || '',
        fitnessTitle: s.fitness_title || '',
        fitnessDesc: s.fitness_desc || '',
        fitnessTag1: s.fitness_tag_1 || '',
        fitnessTag2: s.fitness_tag_2 || '',
        fitnessTag3: s.fitness_tag_3 || '',
        fitnessTag4: s.fitness_tag_4 || '',
        fitnessTag5: s.fitness_tag_5 || '',
        fitnessPhotosPlaceholder: s.fitness_photos_placeholder || '',
        hobbiesTitle: s.hobbies_title || '',
        hobby1: s.hobby_1 || '',
        hobby2: s.hobby_2 || '',
        hobby3: s.hobby_3 || '',
        hobby4: s.hobby_4 || '',
        hobby5: s.hobby_5 || '',
        hobby6: s.hobby_6 || '',
        contactBadge: s.contact_badge || '',
        contactTitle: s.contact_title || '',
        contactDesc: s.contact_desc || '',
        contactEmail: s.contact_email || '',
        contactNamePlaceholder: s.contact_name_placeholder || '',
        contactEmailPlaceholder: s.contact_email_placeholder || '',
        contactMessagePlaceholder: s.contact_message_placeholder || '',
        contactButton: s.contact_button || '',
        contactSuccess: s.contact_success || '',
        socialLinks: {
          weibo: s.social_weibo || '',
          instagram: s.social_instagram || '',
          x: s.social_x || '',
          github: s.social_github || '',
          email: s.contact_email || '',
        },
      })
    } catch (error) {
      console.error('获取设置失败:', error)
    } finally {
      setSettingsLoading(false)
    }
  }

  const categories = [
    settings?.albumCategoryAll || '全部',
    settings?.albumCategory1 || '风景',
    settings?.albumCategory2 || '人像',
    settings?.albumCategory3 || '美食',
    settings?.albumCategory4 || '小动物',
    settings?.albumCategory5 || '其他',
  ]

  const fetchPhotos = async () => {
    try {
      setLoading(true)
      const res = await photosApi.getAll()
      // 转换字段名
      const formattedPhotos = res.photos.map((p: any) => ({
        id: p.id,
        title: p.title,
        description: p.description || '',
        imageUrl: p.image_url,
        category: p.category,
        isFeatured: p.is_featured,
        createdAt: p.created_at,
      }))
      setPhotos(formattedPhotos)
      setFilteredPhotos(formattedPhotos)
    } catch (error) {
      console.error('获取照片列表失败:', error)
      setPhotos([])
      setFilteredPhotos([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (activeCategory === '全部') {
      setFilteredPhotos(photos)
    } else {
      setFilteredPhotos(photos.filter((photo) => photo.category === activeCategory))
    }
  }, [activeCategory, photos])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: settingsLoading ? 0 : 1 }}
      transition={{ duration: 0.3 }}
      className="pt-24 md:pt-28 pb-20 px-4"
    >
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-4">
            <Image className="w-5 h-5 text-primary mr-2" />
            <span className="text-primary text-sm font-medium tracking-wider uppercase">
              {settings?.albumBadge || 'Album'}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{settings?.albumTitle || '相册'}</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto whitespace-pre-line">
            {settings?.albumDesc || '随手拍的一些照片，记录生活中的点点滴滴\n随便看看吧～'}
          </p>
        </motion.div>

        {/* 分类筛选 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-12"
        >
          <Filter className="w-5 h-5 text-muted-foreground mr-2" />
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                'px-5 py-2 rounded-full text-sm font-medium transition-all duration-300',
                activeCategory === category
                  ? 'bg-primary text-white shadow-lg shadow-primary/30'
                  : 'bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground'
              )}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* 加载状态 */}
        {loading && (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          </div>
        )}

        {/* 照片网格 */}
        {!loading && filteredPhotos.length > 0 && (
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <PhotoGrid photos={filteredPhotos} layout="grid" />
          </motion.div>
        )}

        {/* 空状态 */}
        {!loading && filteredPhotos.length === 0 && (
          <div className="text-center py-20">
            <Image className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">{settings?.albumEmpty || '还没有照片～'}</p>
          </div>
        )}


      </div>
    </motion.div>
  )
}

export default Portfolio
