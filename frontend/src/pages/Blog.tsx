import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileText, Calendar, Loader2 } from 'lucide-react'
import { blogApi, settingsApi } from '@/lib/api'
import type { BlogPost, SiteSettings } from '@/types'

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [settingsLoading, setSettingsLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
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
        albumBadge: s.album_badge || '',
        albumTitle: s.album_title || '',
        albumDesc: s.album_desc || '',
        albumCategoryAll: s.album_category_all || '',
        albumCategory1: s.album_category_1 || '',
        albumCategory2: s.album_category_2 || '',
        albumCategory3: s.album_category_3 || '',
        albumCategory4: s.album_category_4 || '',
        albumCategory5: s.album_category_5 || '',
        albumEmpty: s.album_empty || '',
        blogBadge: s.blog_badge || 'Blog',
        blogTitle: s.blog_title || '生活随笔',
        blogDesc: s.blog_desc || '记录生活中的点点滴滴，一些想法，一些感受',
        blogEmpty: s.blog_empty || '还没有写过随笔～',
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

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const res = await blogApi.getAll()
      // 转换字段名
      const formattedPosts = res.posts.map((p: any) => ({
        id: p.id,
        title: p.title,
        content: p.content || '',
        coverImage: p.cover_image || '',
        createdAt: p.created_at?.split('T')[0] || '',
        updatedAt: p.updated_at?.split('T')[0] || '',
      }))
      setPosts(formattedPosts)
    } catch (error) {
      console.error('获取随笔列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: settingsLoading ? 0 : 1 }}
      transition={{ duration: 0.3 }}
      className="pt-24 md:pt-28 pb-20 px-4"
    >
      <div className="max-w-4xl mx-auto">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-4">
            <FileText className="w-5 h-5 text-primary mr-2" />
            <span className="text-primary text-sm font-medium tracking-wider uppercase">
              {settings?.blogBadge || 'Blog'}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{settings?.blogTitle || '生活随笔'}</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {settings?.blogDesc || '记录生活中的点点滴滴，一些想法，一些感受'}
          </p>
        </motion.div>

        {/* 加载状态 */}
        {loading && (
          <div className="text-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">加载中...</p>
          </div>
        )}

        {/* 随笔列表 */}
        {!loading && (
          <div className="space-y-8">
            {posts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-card/30 rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-colors"
              >
                {/* 封面图 */}
                {post.coverImage && (
                  <div className="w-full h-64 overflow-hidden">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                {/* 内容 */}
                <div className="p-8">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{post.createdAt}</span>
                    </div>
                    {post.updatedAt !== post.createdAt && (
                      <span className="text-xs">更新于 {post.updatedAt}</span>
                    )}
                  </div>

                  <h2 className="text-2xl font-bold mb-4">{post.title}</h2>

                  <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {post.content}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {/* 空状态 */}
        {!loading && posts.length === 0 && (
          <div className="text-center py-20">
            <FileText className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">{settings?.blogEmpty || '还没有写过随笔～'}</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default Blog
