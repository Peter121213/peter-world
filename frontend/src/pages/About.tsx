import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, MapPin, Heart, Dumbbell, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { settingsApi } from '@/lib/api'
import type { SiteSettings } from '@/types'

const About = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const res = await settingsApi.get()
      const s: any = res.settings
      setSettings({
        // 基本设置
        siteName: s.site_name || 'Peter 的小世界',
        siteDescription: s.site_description || '',
        navHome: s.nav_home || '首页',
        navAlbum: s.nav_album || '相册',
        navBlog: s.nav_blog || '生活随笔',
        navAbout: s.nav_about || '关于我',
        navContact: s.nav_contact || '联系我',
        footerCopyright: s.footer_copyright || '© 2024 Peter 的小世界. All rights reserved.',

        // 首页 - Hero
        heroBadge: s.hero_badge || '',
        heroTitle: s.hero_title || '',
        heroSubtitle: s.hero_subtitle || '',
        heroButton1: s.hero_button1 || '',
        heroButton2: s.hero_button2 || '',
        heroImage: s.hero_image || '',

        // 首页 - 精选照片
        featuredPhotosBadge: s.featured_photos_badge || '',
        featuredPhotosTitle: s.featured_photos_title || '',
        featuredPhotosDesc: s.featured_photos_desc || '',
        featuredPhotosViewAll: s.featured_photos_view_all || '',

        // 首页 - 最近随笔
        recentPostsBadge: s.recent_posts_badge || '',
        recentPostsTitle: s.recent_posts_title || '',
        recentPostsDesc: s.recent_posts_desc || '',
        recentPostsViewAll: s.recent_posts_view_all || '',

        // 首页 - 音乐
        musicBadge: s.music_badge || '',
        musicSectionTitle: s.music_section_title || '',
        musicSectionDescription: s.music_section_description || '',
        musicButton: s.music_button || '',

        // 首页 - 关于我预览
        aboutTitle: s.about_title || '关于我',
        aboutContent: s.about_content || '',
        aboutImage: s.about_image || '',
        aboutPreviewButton: s.about_preview_button || '',

        // 相册页面
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

        // 生活随笔页面
        blogBadge: s.blog_badge || '',
        blogTitle: s.blog_title || '',
        blogDesc: s.blog_desc || '',
        blogEmpty: s.blog_empty || '',

        // 关于我页面
        aboutBadge: s.about_badge || 'About Me',
        aboutPageDesc: s.about_page_desc || '一个普通的打工人，\n在这里记录我的生活和一些碎碎念',
        aboutLocation: s.about_location || '中国 · 成都',
        aboutLove: s.about_love || '热爱生活',
        aboutButton: s.about_button || '联系我',
        aboutPageImage: s.about_page_image || '',

        // 关于我页面 - 健身
        fitnessBadge: s.fitness_badge || 'Fitness',
        fitnessTitle: s.fitness_title || '关于健身',
        fitnessDesc: s.fitness_desc || '健身 5 年多了，从一个胖子慢慢瘦了下来。\n虽然现在练得还是不怎么样，但是一直在坚持的路上～',
        fitnessTag1: s.fitness_tag_1 || '健身 5 年+',
        fitnessTag2: s.fitness_tag_2 || '瘦掉 25kg 肉',
        fitnessTag3: s.fitness_tag_3 || '减肥一只在路上之人',
        fitnessTag4: s.fitness_tag_4 || '永远练不起来之人',
        fitnessTag5: s.fitness_tag_5 || '有氧爱好者',
        fitnessPhotosPlaceholder: s.fitness_photos_placeholder || '健身照片区域（以后可以在这里放健身照片）',

        // 关于我页面 - 兴趣爱好
        hobbiesTitle: s.hobbies_title || '兴趣爱好',
        hobby1: s.hobby_1 || '音乐',
        hobby2: s.hobby_2 || '电影',
        hobby3: s.hobby_3 || '游戏',
        hobby4: s.hobby_4 || '美食',
        hobby5: s.hobby_5 || '旅行',
        hobby6: s.hobby_6 || '健身',

        // 联系页面
        contactBadge: s.contact_badge || '',
        contactTitle: s.contact_title || '',
        contactDesc: s.contact_desc || '',
        contactEmail: s.contact_email || '',
        contactNamePlaceholder: s.contact_name_placeholder || '',
        contactEmailPlaceholder: s.contact_email_placeholder || '',
        contactMessagePlaceholder: s.contact_message_placeholder || '',
        contactButton: s.contact_button || '',
        contactSuccess: s.contact_success || '',

        // 社交链接
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
      setLoading(false)
    }
  }

  const fitnessTags = [
    settings?.fitnessTag1 || '健身 5 年+',
    settings?.fitnessTag2 || '瘦掉 25kg 肉',
    settings?.fitnessTag3 || '减肥一只在路上之人',
    settings?.fitnessTag4 || '永远练不起来之人',
    settings?.fitnessTag5 || '有氧爱好者',
  ]

  const hobbies = [
    settings?.hobby1 || '音乐',
    settings?.hobby2 || '电影',
    settings?.hobby3 || '游戏',
    settings?.hobby4 || '美食',
    settings?.hobby5 || '旅行',
    settings?.hobby6 || '健身',
  ]

  const aboutTitle = settings?.aboutTitle || '关于我'
  const aboutContent = (settings?.aboutContent || '你好，我是 Peter，一个普通人。').replace(/\\n/g, '\n')
  const aboutPageImage = settings?.aboutPageImage || ''

  if (loading) {
    return (
      <div className="pt-24 md:pt-28 pb-20 px-4">
        <div className="text-center py-20">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 md:pt-28 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-4">
            <User className="w-5 h-5 text-primary mr-2" />
            <span className="text-primary text-sm font-medium tracking-wider uppercase">
              {settings?.aboutBadge || 'About Me'}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{aboutTitle}</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto whitespace-pre-line">
            {settings?.aboutPageDesc || '一个普通的打工人，\n在这里记录我的生活和一些碎碎念'}
          </p>
        </motion.div>

        {/* 个人介绍 */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-card/50">
              {aboutPageImage && (
                <motion.img
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  src={aboutPageImage}
                  alt="Peter"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-6">你好，我是 Peter 👋</h2>
            <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
              {aboutContent.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>

            <div className="flex flex-wrap gap-6 mt-8">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <MapPin className="w-5 h-5 text-primary" />
                <span>{settings?.aboutLocation || '中国 · 成都'}</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Heart className="w-5 h-5 text-primary" />
                <span>{settings?.aboutLove || '热爱生活'}</span>
              </div>
            </div>

            <Link to="/contact" className="btn-primary inline-flex items-center space-x-2 mt-8">
              <span>{settings?.aboutButton || '联系我'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        {/* 健身板块 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-4">
                <Dumbbell className="w-5 h-5 text-primary mr-2" />
                <span className="text-primary text-sm font-medium tracking-wider uppercase">
                  {settings?.fitnessBadge || 'Fitness'}
                </span>
              </div>
              <h2 className="text-3xl font-bold mb-4">{settings?.fitnessTitle || '关于健身'}</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto whitespace-pre-line">
                {settings?.fitnessDesc || '健身 5 年多了，从一个胖子慢慢瘦了下来。\n虽然现在练得还是不怎么样，但是一直在坚持的路上～'}
              </p>
            </div>

            {/* 健身标签 */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {fitnessTags.map((tag, index) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="px-5 py-2.5 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20"
                >
                  {tag}
                </motion.span>
              ))}
            </div>

            {/* 健身照片区域（预留位置） */}
            <div className="bg-card/30 rounded-2xl p-8 border border-white/10 border-dashed text-center">
              <Dumbbell className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">
                {settings?.fitnessPhotosPlaceholder || '健身照片区域（以后可以在这里放健身照片）'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* 兴趣爱好 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold mb-8">{settings?.hobbiesTitle || '兴趣爱好'}</h2>
          <div className="flex flex-wrap justify-center gap-4 max-w-2xl mx-auto">
            {hobbies.map((hobby, index) => (
              <motion.div
                key={hobby}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="px-6 py-3 bg-card/50 rounded-full border border-white/10 text-sm"
              >
                {hobby}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default About
