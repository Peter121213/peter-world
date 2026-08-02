import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { settingsApi } from '@/lib/api'
import type { SiteSettings } from '@/types'

interface SettingsContextType {
  settings: SiteSettings | null
  loading: boolean
  refreshSettings: () => Promise<void>
}

const SettingsContext = createContext<SettingsContextType>({
  settings: null,
  loading: true,
  refreshSettings: async () => {},
})

export const useSettings = () => useContext(SettingsContext)

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const res = await settingsApi.get()
      const s: any = res.settings
      setSettings({
        // 基本设置
        siteName: s.site_name || 'Peter 的小世界',
        siteDescription: s.site_description || '用镜头记录美好，用音乐传递情感。',
        navHome: s.nav_home || '首页',
        navAlbum: s.nav_album || '相册',
        navBlog: s.nav_blog || '生活随笔',
        navAbout: s.nav_about || '关于我',
        navContact: s.nav_contact || '联系我',
        footerCopyright: s.footer_copyright || '© {year} Peter 的小世界. All rights reserved.',
        visitCount: s.visit_count || '0',

        // 首页 - Hero
        heroBadge: s.hero_badge || '欢迎来到我的小世界',
        heroTitle: s.hero_title || '用镜头记录美好，\n用音乐传递情感',
        heroSubtitle: s.hero_subtitle || '这里有一些我的生活碎片和喜欢的音乐\n随便坐坐，听听歌，看看照片',
        heroButton1: s.hero_button1 || '随便看看',
        heroButton2: s.hero_button2 || '关于我',
        heroImage: s.hero_image || '',

        // 首页 - 精选照片
        featuredPhotosBadge: s.featured_photos_badge || 'Featured Photos',
        featuredPhotosTitle: s.featured_photos_title || '精选照片',
        featuredPhotosDesc: s.featured_photos_desc || '一些我觉得还不错的照片，记录生活中的小美好',
        featuredPhotosViewAll: s.featured_photos_view_all || '查看全部照片',

        // 首页 - 最近随笔
        recentPostsBadge: s.recent_posts_badge || 'Recent Posts',
        recentPostsTitle: s.recent_posts_title || '最近随笔',
        recentPostsDesc: s.recent_posts_desc || '随便写写，记录一下生活',
        recentPostsViewAll: s.recent_posts_view_all || '查看全部随笔',

        // 首页 - 音乐
        musicBadge: s.music_badge || 'Music',
        musicSectionTitle: s.music_section_title || '音乐陪伴',
        musicSectionDescription: s.music_section_description || '',
        musicButton: s.music_button || '播放音乐',

        // 首页 - 关于我预览
        aboutTitle: s.about_title || '关于我',
        aboutContent: s.about_content || '你好，我是 Peter，一个热爱摄影和音乐的普通人。',
        aboutImage: s.about_image || '',
        aboutPreviewButton: s.about_preview_button || '了解更多',

        // 相册页面
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

        // 生活随笔页面
        blogBadge: s.blog_badge || 'Blog',
        blogTitle: s.blog_title || '生活随笔',
        blogDesc: s.blog_desc || '记录生活中的点点滴滴，一些想法，一些感受',
        blogEmpty: s.blog_empty || '还没有写过随笔～',

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
        contactBadge: s.contact_badge || 'Contact',
        contactTitle: s.contact_title || '联系我',
        contactDesc: s.contact_desc || '有任何问题、合作意向，或者只是想打个招呼？\n欢迎随时联系我，我会尽快回复你。',
        contactEmail: s.contact_email || '',
        contactTip: s.contact_tip || '如果你是通过作品找到我的，欢迎告诉我你最喜欢哪张照片，这会让我很开心的！',
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
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}
