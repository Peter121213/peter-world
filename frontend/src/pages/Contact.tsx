import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Mail,
  MessageSquare,
  Send,
  Instagram,
  Github,
  MessageCircle,
  CheckCircle,
} from 'lucide-react'
import { settingsApi } from '@/lib/api'
import type { SiteSettings } from '@/types'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [settingsLoading, setSettingsLoading] = useState(true)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setSettingsLoading(true)
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
        footerCopyright: s.footer_copyright || '',

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
        aboutTitle: s.about_title || '',
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
        aboutBadge: s.about_badge || '',
        aboutPageDesc: s.about_page_desc || '',
        aboutLocation: s.about_location || '',
        aboutLove: s.about_love || '',
        aboutButton: s.about_button || '',
        aboutPageImage: s.about_page_image || '',

        // 关于我页面 - 健身
        fitnessBadge: s.fitness_badge || '',
        fitnessTitle: s.fitness_title || '',
        fitnessDesc: s.fitness_desc || '',
        fitnessTag1: s.fitness_tag_1 || '',
        fitnessTag2: s.fitness_tag_2 || '',
        fitnessTag3: s.fitness_tag_3 || '',
        fitnessTag4: s.fitness_tag_4 || '',
        fitnessTag5: s.fitness_tag_5 || '',
        fitnessPhotosPlaceholder: s.fitness_photos_placeholder || '',

        // 关于我页面 - 兴趣爱好
        hobbiesTitle: s.hobbies_title || '',
        hobby1: s.hobby_1 || '',
        hobby2: s.hobby_2 || '',
        hobby3: s.hobby_3 || '',
        hobby4: s.hobby_4 || '',
        hobby5: s.hobby_5 || '',
        hobby6: s.hobby_6 || '',

        // 联系页面
        contactBadge: s.contact_badge || 'Contact',
        contactTitle: s.contact_title || '联系我',
        contactDesc: s.contact_desc || '有任何问题、合作意向，或者只是想打个招呼？\n欢迎随时联系我，我会尽快回复你。',
        contactEmail: s.contact_email || '',
        contactNamePlaceholder: s.contact_name_placeholder || '你的名字',
        contactEmailPlaceholder: s.contact_email_placeholder || 'your@email.com',
        contactMessagePlaceholder: s.contact_message_placeholder || '想说点什么...',
        contactButton: s.contact_button || '发送留言',
        contactSuccess: s.contact_success || '感谢你的留言，我会尽快回复你。',

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
      setSettingsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // 模拟提交
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSubmitted(true)
    setFormData({ name: '', email: '', message: '' })

    // 3秒后重置状态
    setTimeout(() => setIsSubmitted(false), 3000)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  // X (Twitter) 图标
  const XIcon = () => (
    <svg
      viewBox="0 0 24 24"
      className="w-5 h-5"
      fill="currentColor"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )

  // 微博图标
  const WeiboIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M10.098 20.323c-3.977.391-7.414-1.406-7.672-4.02-.259-2.609 2.759-5.047 6.74-5.441 3.979-.394 7.413 1.404 7.671 4.018.259 2.6-2.759 5.049-6.739 5.443zM9.05 17.219c-.384.616-1.208.884-1.829.602-.612-.279-.793-.991-.406-1.593.379-.595 1.176-.861 1.793-.601.622.263.82.972.442 1.592zm1.27-1.627c-.141.237-.449.353-.689.253-.236-.09-.313-.361-.177-.586.138-.227.436-.346.672-.24.239.09.315.36.194.573zm.176-2.719c-1.893-.493-4.033.45-4.857 2.118-.836 1.704-.026 3.591 1.886 4.21 1.983.64 4.318-.341 5.132-2.179.8-1.793-.201-3.642-2.161-4.149zm7.563-1.224c-.346-.105-.57-.18-.405-.649.359-1.017.389-1.891.003-2.521-.722-1.177-2.69-1.112-4.986-.033 0 0-.712.309-.529-.254.354-1.147.288-2.112-.274-2.643-1.264-1.186-4.372.043-6.942 2.742C2.903 10.935 1.5 13.546 1.5 15.83c0 4.29 5.109 6.866 10.142 6.866 6.529 0 10.822-3.878 10.822-6.948 0-1.852-1.563-2.9-3.405-3.405-.654-.181-1.313-.284-1.97-.353z"/>
    </svg>
  )

  const socialList = [
    { name: 'Instagram', icon: Instagram, url: settings?.socialLinks?.instagram || '', color: 'hover:text-pink-500', show: !!settings?.socialLinks?.instagram },
    { name: 'X', icon: XIcon, url: settings?.socialLinks?.x || '', color: 'hover:text-blue-400', show: !!settings?.socialLinks?.x },
    { name: '微博', icon: WeiboIcon, url: settings?.socialLinks?.weibo || '', color: 'hover:text-red-500', show: !!settings?.socialLinks?.weibo },
    { name: 'GitHub', icon: Github, url: settings?.socialLinks?.github || '', color: 'hover:text-gray-300', show: !!settings?.socialLinks?.github },
  ].filter(item => item.show)

  const contactEmail = settings?.socialLinks?.email || 'hello@peter.world'

  return (
    <div className="pt-24 md:pt-28 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-4">
            <MessageSquare className="w-5 h-5 text-primary mr-2" />
            <span className="text-primary text-sm font-medium tracking-wider uppercase">
              {settings?.contactBadge || 'Contact'}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{settings?.contactTitle || '联系我'}</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto whitespace-pre-line">
            {settings?.contactDesc || '有任何问题、合作意向，或者只是想打个招呼？\n欢迎随时联系我，我会尽快回复你。'}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-12">
          {/* 联系信息 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-span-2 space-y-8"
          >
            <div>
              <h3 className="text-xl font-semibold mb-6">联系方式</h3>
              <div className="space-y-4">
                <a
                  href={`mailto:${contactEmail}`}
                  className="flex items-center space-x-4 p-4 bg-card/50 rounded-xl border border-white/10 hover:border-primary/50 transition-colors group"
                >
                  <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">邮箱</div>
                    <div className="font-medium">{contactEmail}</div>
                  </div>
                </a>
              </div>
            </div>

            {socialList.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-6">社交媒体</h3>
                <div className="grid grid-cols-2 gap-4">
                  {socialList.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center justify-center space-x-2 p-4 bg-card/50 rounded-xl border border-white/10 hover:border-primary/50 transition-all ${social.color}`}
                    >
                      <social.icon className="w-5 h-5" />
                      <span className="text-sm">{social.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20">
              <h4 className="font-semibold mb-2">💡 小提示</h4>
              <p className="text-sm text-muted-foreground">
                如果你是通过作品找到我的，欢迎告诉我你最喜欢哪张照片，
                这会让我很开心的！
              </p>
            </div>
          </motion.div>

          {/* 联系表单 */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-span-3"
          >
            <div className="bg-card/50 rounded-2xl p-8 border border-white/10">
              <h3 className="text-xl font-semibold mb-6">给我留言</h3>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold mb-2">发送成功！</h4>
                  <p className="text-muted-foreground">
                    {settings?.contactSuccess || '感谢你的留言，我会尽快回复你。'}
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium mb-2"
                      >
                        姓名
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-background/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors"
                        placeholder={settings?.contactNamePlaceholder || '你的名字'}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium mb-2"
                      >
                        邮箱
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-background/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors"
                        placeholder={settings?.contactEmailPlaceholder || 'your@email.com'}
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium mb-2"
                    >
                      留言内容
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-background/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors resize-none"
                      placeholder={settings?.contactMessagePlaceholder || '想说点什么...'}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>发送中...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>{settings?.contactButton || '发送留言'}</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Contact
