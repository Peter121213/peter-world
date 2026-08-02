import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Settings as SettingsIcon,
  Save,
  User,
  Lock,
  Globe,
  Link,
  Image,
  Music,
  Home,
  BookOpen,
  Mail,
  Dumbbell,
  Loader2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { settingsApi, authApi } from '@/lib/api'

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general')
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [loading, setLoading] = useState(true)

  // 基本设置
  const [generalSettings, setGeneralSettings] = useState({
    siteName: '',
    siteDescription: '',
    navHome: '',
    navAlbum: '',
    navBlog: '',
    navAbout: '',
    navContact: '',
    footerCopyright: '',
  })

  // 首页设置
  const [homeSettings, setHomeSettings] = useState({
    // Hero
    heroBadge: '',
    heroTitle: '',
    heroSubtitle: '',
    heroButton1: '',
    heroButton2: '',
    heroImage: '',
    // 精选照片
    featuredPhotosBadge: '',
    featuredPhotosTitle: '',
    featuredPhotosDesc: '',
    featuredPhotosViewAll: '',
    // 最近随笔
    recentPostsBadge: '',
    recentPostsTitle: '',
    recentPostsDesc: '',
    recentPostsViewAll: '',
    // 音乐
    musicBadge: '',
    musicSectionTitle: '',
    musicSectionDescription: '',
    musicButton: '',
    // 关于我预览
    aboutTitle: '',
    aboutContent: '',
    aboutImage: '',
    aboutPreviewButton: '',
  })

  // 相册页面
  const [albumSettings, setAlbumSettings] = useState({
    albumBadge: '',
    albumTitle: '',
    albumDesc: '',
    albumCategoryAll: '',
    albumCategory1: '',
    albumCategory2: '',
    albumCategory3: '',
    albumCategory4: '',
    albumCategory5: '',
    albumEmpty: '',
  })

  // 生活随笔
  const [blogSettings, setBlogSettings] = useState({
    blogBadge: '',
    blogTitle: '',
    blogDesc: '',
    blogEmpty: '',
  })

  // 关于我页面
  const [aboutSettings, setAboutSettings] = useState({
    // 基本信息
    aboutBadge: '',
    aboutPageDesc: '',
    aboutLocation: '',
    aboutLove: '',
    aboutButton: '',
    aboutPageImage: '',
    // 健身
    fitnessBadge: '',
    fitnessTitle: '',
    fitnessDesc: '',
    fitnessTag1: '',
    fitnessTag2: '',
    fitnessTag3: '',
    fitnessTag4: '',
    fitnessTag5: '',
    fitnessPhotosPlaceholder: '',
    // 兴趣爱好
    hobbiesTitle: '',
    hobby1: '',
    hobby2: '',
    hobby3: '',
    hobby4: '',
    hobby5: '',
    hobby6: '',
  })

  // 联系页面
  const [contactSettings, setContactSettings] = useState({
    contactBadge: '',
    contactTitle: '',
    contactDesc: '',
    contactEmail: '',
    contactTip: '',
    contactNamePlaceholder: '',
    contactEmailPlaceholder: '',
    contactMessagePlaceholder: '',
    contactButton: '',
    contactSuccess: '',
  })

  // 社交链接
  const [socialSettings, setSocialSettings] = useState({
    weibo: '',
    instagram: '',
    x: '',
    github: '',
  })

  // 修改密码
  const [passwordSettings, setPasswordSettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const tabs = [
    { id: 'general', label: '基本设置', icon: Globe },
    { id: 'home', label: '首页设置', icon: Home },
    { id: 'album', label: '相册页面', icon: Image },
    { id: 'blog', label: '生活随笔', icon: BookOpen },
    { id: 'about', label: '关于我', icon: User },
    { id: 'contact', label: '联系页面', icon: Mail },
    { id: 'social', label: '社交链接', icon: Link },
    { id: 'password', label: '修改密码', icon: Lock },
  ]

  // 页面加载时获取设置
  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const res = await settingsApi.get()
      const s: any = res.settings

      // 基本设置
      setGeneralSettings({
        siteName: s.site_name || 'Peter 的小世界',
        siteDescription: s.site_description || '用镜头记录美好，用音乐传递情感',
        navHome: s.nav_home || '首页',
        navAlbum: s.nav_album || '相册',
        navBlog: s.nav_blog || '生活随笔',
        navAbout: s.nav_about || '关于我',
        navContact: s.nav_contact || '联系我',
        footerCopyright: s.footer_copyright || '© {year} Peter 的小世界. All rights reserved.',
      })

      // 首页设置
      setHomeSettings({
        heroBadge: s.hero_badge || '欢迎来到我的小世界',
        heroTitle: s.hero_title || '',
        heroSubtitle: s.hero_subtitle || '',
        heroButton1: s.hero_button1 || '随便看看',
        heroButton2: s.hero_button2 || '关于我',
        heroImage: s.hero_image || '',
        featuredPhotosBadge: s.featured_photos_badge || 'Featured Photos',
        featuredPhotosTitle: s.featured_photos_title || '精选照片',
        featuredPhotosDesc: s.featured_photos_desc || '一些我觉得还不错的照片，记录生活中的小美好',
        featuredPhotosViewAll: s.featured_photos_view_all || '查看全部照片',
        recentPostsBadge: s.recent_posts_badge || 'Recent Posts',
        recentPostsTitle: s.recent_posts_title || '最近随笔',
        recentPostsDesc: s.recent_posts_desc || '随便写写，记录一下生活',
        recentPostsViewAll: s.recent_posts_view_all || '查看全部随笔',
        musicBadge: s.music_badge || 'Music',
        musicSectionTitle: s.music_section_title || '音乐陪伴',
        musicSectionDescription: s.music_section_description || '',
        musicButton: s.music_button || '播放音乐',
        aboutTitle: s.about_title || '关于我',
        aboutContent: s.about_content || '',
        aboutImage: s.about_image || '',
        aboutPreviewButton: s.about_preview_button || '了解更多',
      })

      // 相册页面
      setAlbumSettings({
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
      })

      // 生活随笔
      setBlogSettings({
        blogBadge: s.blog_badge || 'Blog',
        blogTitle: s.blog_title || '生活随笔',
        blogDesc: s.blog_desc || '记录生活中的点点滴滴，一些想法，一些感受',
        blogEmpty: s.blog_empty || '还没有写过随笔～',
      })

      // 关于我页面
      setAboutSettings({
        aboutBadge: s.about_badge || 'About Me',
        aboutPageDesc: s.about_page_desc || '一个普通的打工人，\n在这里记录我的生活和一些碎碎念',
        aboutLocation: s.about_location || '中国 · 成都',
        aboutLove: s.about_love || '热爱生活',
        aboutButton: s.about_button || '联系我',
        aboutPageImage: s.about_page_image || '',
        fitnessBadge: s.fitness_badge || 'Fitness',
        fitnessTitle: s.fitness_title || '关于健身',
        fitnessDesc: s.fitness_desc || '健身 5 年多了，从一个胖子慢慢瘦了下来。\n虽然现在练得还是不怎么样，但是一直在坚持的路上～',
        fitnessTag1: s.fitness_tag_1 || '健身 5 年+',
        fitnessTag2: s.fitness_tag_2 || '瘦掉 25kg 肉',
        fitnessTag3: s.fitness_tag_3 || '减肥一只在路上之人',
        fitnessTag4: s.fitness_tag_4 || '永远练不起来之人',
        fitnessTag5: s.fitness_tag_5 || '有氧爱好者',
        fitnessPhotosPlaceholder: s.fitness_photos_placeholder || '健身照片区域（以后可以在这里放健身照片）',
        hobbiesTitle: s.hobbies_title || '兴趣爱好',
        hobby1: s.hobby_1 || '音乐',
        hobby2: s.hobby_2 || '电影',
        hobby3: s.hobby_3 || '游戏',
        hobby4: s.hobby_4 || '美食',
        hobby5: s.hobby_5 || '旅行',
        hobby6: s.hobby_6 || '健身',
      })

      // 联系页面
      setContactSettings({
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
      })

      // 社交链接
      setSocialSettings({
        weibo: s.social_weibo || '',
        instagram: s.social_instagram || '',
        x: s.social_x || '',
        github: s.social_github || '',
      })
    } catch (error) {
      console.error('获取设置失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaveSuccess(false)

    try {
      // 修改密码单独处理
      if (activeTab === 'password') {
        if (!passwordSettings.currentPassword) {
          alert('请输入当前密码')
          setIsSaving(false)
          return
        }
        if (!passwordSettings.newPassword) {
          alert('请输入新密码')
          setIsSaving(false)
          return
        }
        if (passwordSettings.newPassword.length < 6) {
          alert('新密码长度不能少于6位')
          setIsSaving(false)
          return
        }
        if (passwordSettings.newPassword !== passwordSettings.confirmPassword) {
          alert('两次输入的新密码不一致')
          setIsSaving(false)
          return
        }
        
        await authApi.changePassword(
          passwordSettings.currentPassword,
          passwordSettings.newPassword
        )
        
        setPasswordSettings({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        })
        
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 3000)
        setIsSaving(false)
        return
      }

      // 其他设置统一保存
      let settingsToSave: any = {}

      if (activeTab === 'general') {
        settingsToSave = {
          site_name: generalSettings.siteName,
          site_description: generalSettings.siteDescription,
          nav_home: generalSettings.navHome,
          nav_album: generalSettings.navAlbum,
          nav_blog: generalSettings.navBlog,
          nav_about: generalSettings.navAbout,
          nav_contact: generalSettings.navContact,
          footer_copyright: generalSettings.footerCopyright,
        }
      } else if (activeTab === 'home') {
        settingsToSave = {
          hero_badge: homeSettings.heroBadge,
          hero_title: homeSettings.heroTitle,
          hero_subtitle: homeSettings.heroSubtitle,
          hero_button1: homeSettings.heroButton1,
          hero_button2: homeSettings.heroButton2,
          hero_image: homeSettings.heroImage,
          featured_photos_badge: homeSettings.featuredPhotosBadge,
          featured_photos_title: homeSettings.featuredPhotosTitle,
          featured_photos_desc: homeSettings.featuredPhotosDesc,
          featured_photos_view_all: homeSettings.featuredPhotosViewAll,
          recent_posts_badge: homeSettings.recentPostsBadge,
          recent_posts_title: homeSettings.recentPostsTitle,
          recent_posts_desc: homeSettings.recentPostsDesc,
          recent_posts_view_all: homeSettings.recentPostsViewAll,
          music_badge: homeSettings.musicBadge,
          music_section_title: homeSettings.musicSectionTitle,
          music_section_description: homeSettings.musicSectionDescription,
          music_button: homeSettings.musicButton,
          about_title: homeSettings.aboutTitle,
          about_content: homeSettings.aboutContent,
          about_image: homeSettings.aboutImage,
          about_preview_button: homeSettings.aboutPreviewButton,
        }
      } else if (activeTab === 'album') {
        settingsToSave = {
          album_badge: albumSettings.albumBadge,
          album_title: albumSettings.albumTitle,
          album_desc: albumSettings.albumDesc,
          album_category_all: albumSettings.albumCategoryAll,
          album_category_1: albumSettings.albumCategory1,
          album_category_2: albumSettings.albumCategory2,
          album_category_3: albumSettings.albumCategory3,
          album_category_4: albumSettings.albumCategory4,
          album_category_5: albumSettings.albumCategory5,
          album_empty: albumSettings.albumEmpty,
        }
      } else if (activeTab === 'blog') {
        settingsToSave = {
          blog_badge: blogSettings.blogBadge,
          blog_title: blogSettings.blogTitle,
          blog_desc: blogSettings.blogDesc,
          blog_empty: blogSettings.blogEmpty,
        }
      } else if (activeTab === 'about') {
        settingsToSave = {
          about_badge: aboutSettings.aboutBadge,
          about_page_desc: aboutSettings.aboutPageDesc,
          about_location: aboutSettings.aboutLocation,
          about_love: aboutSettings.aboutLove,
          about_button: aboutSettings.aboutButton,
          about_page_image: aboutSettings.aboutPageImage,
          fitness_badge: aboutSettings.fitnessBadge,
          fitness_title: aboutSettings.fitnessTitle,
          fitness_desc: aboutSettings.fitnessDesc,
          fitness_tag_1: aboutSettings.fitnessTag1,
          fitness_tag_2: aboutSettings.fitnessTag2,
          fitness_tag_3: aboutSettings.fitnessTag3,
          fitness_tag_4: aboutSettings.fitnessTag4,
          fitness_tag_5: aboutSettings.fitnessTag5,
          fitness_photos_placeholder: aboutSettings.fitnessPhotosPlaceholder,
          hobbies_title: aboutSettings.hobbiesTitle,
          hobby_1: aboutSettings.hobby1,
          hobby_2: aboutSettings.hobby2,
          hobby_3: aboutSettings.hobby3,
          hobby_4: aboutSettings.hobby4,
          hobby_5: aboutSettings.hobby5,
          hobby_6: aboutSettings.hobby6,
        }
      } else if (activeTab === 'contact') {
        settingsToSave = {
          contact_badge: contactSettings.contactBadge,
          contact_title: contactSettings.contactTitle,
          contact_desc: contactSettings.contactDesc,
          contact_email: contactSettings.contactEmail,
          contact_tip: contactSettings.contactTip,
          contact_name_placeholder: contactSettings.contactNamePlaceholder,
          contact_email_placeholder: contactSettings.contactEmailPlaceholder,
          contact_message_placeholder: contactSettings.contactMessagePlaceholder,
          contact_button: contactSettings.contactButton,
          contact_success: contactSettings.contactSuccess,
        }
      } else if (activeTab === 'social') {
        settingsToSave = {
          social_weibo: socialSettings.weibo,
          social_instagram: socialSettings.instagram,
          social_x: socialSettings.x,
          social_github: socialSettings.github,
        }
      }

      await settingsApi.update(settingsToSave)

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.error('保存设置失败:', error)
      alert('保存失败，请重试')
    } finally {
      setIsSaving(false)
    }
  }

  // 输入框组件 - 非受控模式，输入流畅，中文输入法友好
  const FormField = ({ label, description, value, onChange, type = 'text', placeholder, rows }: any) => (
    <div>
      <label className="block text-sm font-medium mb-1.5">
        {label}
      </label>
      {description && (
        <p className="text-xs text-muted-foreground mb-2">{description}</p>
      )}
      {rows ? (
        <textarea
          defaultValue={value}
          onBlur={(e) => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder}
          className="w-full px-4 py-2.5 bg-background/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors resize-none"
        />
      ) : (
        <input
          type={type}
          defaultValue={value}
          onBlur={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-2.5 bg-background/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors"
        />
      )}
    </div>
  )

  // 分组标题组件
  const SectionTitle = ({ title, icon: Icon }: any) => (
    <div className="flex items-center space-x-2 pb-3 mb-6 border-b border-white/10">
      {Icon && <Icon className="w-5 h-5 text-primary" />}
      <h3 className="text-lg font-semibold">{title}</h3>
    </div>
  )

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="text-center py-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">加载中...</p>
        </div>
      )
    }

    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-8">
            <div>
              <SectionTitle title="网站基本信息" icon={Globe} />
              <div className="space-y-6">
                <FormField
                  label="网站名称"
                  description="显示在浏览器标签页和网站 Logo 处"
                  value={generalSettings.siteName}
                  onChange={(v: string) => setGeneralSettings((p) => ({ ...p, siteName: v }))}
                />
                <FormField
                  label="网站描述"
                  description="简短介绍你的网站，用于 SEO 和页脚显示"
                  value={generalSettings.siteDescription}
                  onChange={(v: string) => setGeneralSettings((p) => ({ ...p, siteDescription: v }))}
                  rows={2}
                />
              </div>
            </div>

            <div>
              <SectionTitle title="导航栏文字" icon={Image} />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <FormField
                  label="首页"
                  value={generalSettings.navHome}
                  onChange={(v: string) => setGeneralSettings((p) => ({ ...p, navHome: v }))}
                />
                <FormField
                  label="相册"
                  value={generalSettings.navAlbum}
                  onChange={(v: string) => setGeneralSettings((p) => ({ ...p, navAlbum: v }))}
                />
                <FormField
                  label="生活随笔"
                  value={generalSettings.navBlog}
                  onChange={(v: string) => setGeneralSettings((p) => ({ ...p, navBlog: v }))}
                />
                <FormField
                  label="关于我"
                  value={generalSettings.navAbout}
                  onChange={(v: string) => setGeneralSettings((p) => ({ ...p, navAbout: v }))}
                />
                <FormField
                  label="联系我"
                  value={generalSettings.navContact}
                  onChange={(v: string) => setGeneralSettings((p) => ({ ...p, navContact: v }))}
                />
              </div>
            </div>

            <div>
              <SectionTitle title="页脚" icon={Image} />
              <div className="space-y-6">
                <FormField
                  label="版权文字"
                  description="页脚底部的版权信息，用 {year} 表示当前年份"
                  value={generalSettings.footerCopyright}
                  onChange={(v: string) => setGeneralSettings((p) => ({ ...p, footerCopyright: v }))}
                  placeholder="© {year} Peter 的小世界. All rights reserved."
                />
              </div>
            </div>
          </div>
        )

      case 'home':
        return (
          <div className="space-y-8">
            {/* Hero 区域 */}
            <div>
              <SectionTitle title="Hero 区域" icon={Image} />
              <div className="space-y-6">
                <FormField
                  label="小标签"
                  description="大标题上面的小字，通常是一句欢迎语"
                  value={homeSettings.heroBadge}
                  onChange={(v: string) => setHomeSettings((p) => ({ ...p, heroBadge: v }))}
                />
                <FormField
                  label="大标题"
                  description="Hero 区域的主标题，换行用回车键"
                  value={homeSettings.heroTitle}
                  onChange={(v: string) => setHomeSettings((p) => ({ ...p, heroTitle: v }))}
                  rows={3}
                />
                <FormField
                  label="副标题"
                  description="大标题下面的描述文字，换行用回车键"
                  value={homeSettings.heroSubtitle}
                  onChange={(v: string) => setHomeSettings((p) => ({ ...p, heroSubtitle: v }))}
                  rows={3}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="按钮1文字"
                    description="左边的按钮，跳转到相册"
                    value={homeSettings.heroButton1}
                    onChange={(v: string) => setHomeSettings((p) => ({ ...p, heroButton1: v }))}
                  />
                  <FormField
                    label="按钮2文字"
                    description="右边的按钮，跳转到关于我"
                    value={homeSettings.heroButton2}
                    onChange={(v: string) => setHomeSettings((p) => ({ ...p, heroButton2: v }))}
                  />
                </div>
                <FormField
                  label="背景图片 URL"
                  description="Hero 区域的背景图片，留空则只显示背景色"
                  value={homeSettings.heroImage}
                  onChange={(v: string) => setHomeSettings((p) => ({ ...p, heroImage: v }))}
                  type="url"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            {/* 精选照片 */}
            <div>
              <SectionTitle title="精选照片区域" icon={Image} />
              <div className="space-y-6">
                <FormField
                  label="小标签"
                  description="大标题上面的英文小字"
                  value={homeSettings.featuredPhotosBadge}
                  onChange={(v: string) => setHomeSettings((p) => ({ ...p, featuredPhotosBadge: v }))}
                />
                <FormField
                  label="大标题"
                  value={homeSettings.featuredPhotosTitle}
                  onChange={(v: string) => setHomeSettings((p) => ({ ...p, featuredPhotosTitle: v }))}
                />
                <FormField
                  label="描述文字"
                  value={homeSettings.featuredPhotosDesc}
                  onChange={(v: string) => setHomeSettings((p) => ({ ...p, featuredPhotosDesc: v }))}
                  rows={2}
                />
                <FormField
                  label="查看全部按钮"
                  value={homeSettings.featuredPhotosViewAll}
                  onChange={(v: string) => setHomeSettings((p) => ({ ...p, featuredPhotosViewAll: v }))}
                />
              </div>
            </div>

            {/* 最近随笔 */}
            <div>
              <SectionTitle title="最近随笔区域" icon={BookOpen} />
              <div className="space-y-6">
                <FormField
                  label="小标签"
                  description="大标题上面的英文小字"
                  value={homeSettings.recentPostsBadge}
                  onChange={(v: string) => setHomeSettings((p) => ({ ...p, recentPostsBadge: v }))}
                />
                <FormField
                  label="大标题"
                  value={homeSettings.recentPostsTitle}
                  onChange={(v: string) => setHomeSettings((p) => ({ ...p, recentPostsTitle: v }))}
                />
                <FormField
                  label="描述文字"
                  value={homeSettings.recentPostsDesc}
                  onChange={(v: string) => setHomeSettings((p) => ({ ...p, recentPostsDesc: v }))}
                  rows={2}
                />
                <FormField
                  label="查看全部按钮"
                  value={homeSettings.recentPostsViewAll}
                  onChange={(v: string) => setHomeSettings((p) => ({ ...p, recentPostsViewAll: v }))}
                />
              </div>
            </div>

            {/* 音乐区域 */}
            <div>
              <SectionTitle title="音乐区域" icon={Music} />
              <div className="space-y-6">
                <FormField
                  label="小标签"
                  description="大标题上面的英文小字"
                  value={homeSettings.musicBadge}
                  onChange={(v: string) => setHomeSettings((p) => ({ ...p, musicBadge: v }))}
                />
                <FormField
                  label="大标题"
                  value={homeSettings.musicSectionTitle}
                  onChange={(v: string) => setHomeSettings((p) => ({ ...p, musicSectionTitle: v }))}
                />
                <FormField
                  label="描述文字"
                  description="换行用回车键"
                  value={homeSettings.musicSectionDescription}
                  onChange={(v: string) => setHomeSettings((p) => ({ ...p, musicSectionDescription: v }))}
                  rows={3}
                />
                <FormField
                  label="按钮文字"
                  value={homeSettings.musicButton}
                  onChange={(v: string) => setHomeSettings((p) => ({ ...p, musicButton: v }))}
                />
              </div>
            </div>

            {/* 关于我预览 */}
            <div>
              <SectionTitle title="关于我预览区域" icon={User} />
              <div className="space-y-6">
                <FormField
                  label="大标题"
                  value={homeSettings.aboutTitle}
                  onChange={(v: string) => setHomeSettings((p) => ({ ...p, aboutTitle: v }))}
                />
                <FormField
                  label="简介内容"
                  description="首页显示的关于我简介，换行用回车键"
                  value={homeSettings.aboutContent}
                  onChange={(v: string) => setHomeSettings((p) => ({ ...p, aboutContent: v }))}
                  rows={6}
                />
                <FormField
                  label="图片 URL"
                  description="首页关于我区域的图片，留空则不显示"
                  value={homeSettings.aboutImage}
                  onChange={(v: string) => setHomeSettings((p) => ({ ...p, aboutImage: v }))}
                  type="url"
                  placeholder="https://example.com/image.jpg"
                />
                <FormField
                  label="按钮文字"
                  value={homeSettings.aboutPreviewButton}
                  onChange={(v: string) => setHomeSettings((p) => ({ ...p, aboutPreviewButton: v }))}
                />
              </div>
            </div>
          </div>
        )

      case 'album':
        return (
          <div className="space-y-8">
            <div>
              <SectionTitle title="页面标题" icon={Image} />
              <div className="space-y-6">
                <FormField
                  label="小标签"
                  description="大标题上面的英文小字"
                  value={albumSettings.albumBadge}
                  onChange={(v: string) => setAlbumSettings((p) => ({ ...p, albumBadge: v }))}
                />
                <FormField
                  label="大标题"
                  value={albumSettings.albumTitle}
                  onChange={(v: string) => setAlbumSettings((p) => ({ ...p, albumTitle: v }))}
                />
                <FormField
                  label="描述文字"
                  description="大标题下面的描述，换行用回车键"
                  value={albumSettings.albumDesc}
                  onChange={(v: string) => setAlbumSettings((p) => ({ ...p, albumDesc: v }))}
                  rows={3}
                />
              </div>
            </div>

            <div>
              <SectionTitle title="照片分类" icon={Image} />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <FormField
                  label="全部"
                  description="显示所有照片的分类名"
                  value={albumSettings.albumCategoryAll}
                  onChange={(v: string) => setAlbumSettings((p) => ({ ...p, albumCategoryAll: v }))}
                />
                <FormField
                  label="分类1"
                  value={albumSettings.albumCategory1}
                  onChange={(v: string) => setAlbumSettings((p) => ({ ...p, albumCategory1: v }))}
                />
                <FormField
                  label="分类2"
                  value={albumSettings.albumCategory2}
                  onChange={(v: string) => setAlbumSettings((p) => ({ ...p, albumCategory2: v }))}
                />
                <FormField
                  label="分类3"
                  value={albumSettings.albumCategory3}
                  onChange={(v: string) => setAlbumSettings((p) => ({ ...p, albumCategory3: v }))}
                />
                <FormField
                  label="分类4"
                  value={albumSettings.albumCategory4}
                  onChange={(v: string) => setAlbumSettings((p) => ({ ...p, albumCategory4: v }))}
                />
                <FormField
                  label="分类5"
                  value={albumSettings.albumCategory5}
                  onChange={(v: string) => setAlbumSettings((p) => ({ ...p, albumCategory5: v }))}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                注意：修改分类名后，已上传照片的分类不会自动更新，需要重新编辑照片的分类
              </p>
            </div>

            <div>
              <SectionTitle title="空状态" icon={Image} />
              <div className="space-y-6">
                <FormField
                  label="没有照片时显示"
                  value={albumSettings.albumEmpty}
                  onChange={(v: string) => setAlbumSettings((p) => ({ ...p, albumEmpty: v }))}
                />
              </div>
            </div>
          </div>
        )

      case 'blog':
        return (
          <div className="space-y-8">
            <div>
              <SectionTitle title="页面标题" icon={BookOpen} />
              <div className="space-y-6">
                <FormField
                  label="小标签"
                  description="大标题上面的英文小字"
                  value={blogSettings.blogBadge}
                  onChange={(v: string) => setBlogSettings((p) => ({ ...p, blogBadge: v }))}
                />
                <FormField
                  label="大标题"
                  value={blogSettings.blogTitle}
                  onChange={(v: string) => setBlogSettings((p) => ({ ...p, blogTitle: v }))}
                />
                <FormField
                  label="描述文字"
                  description="大标题下面的描述"
                  value={blogSettings.blogDesc}
                  onChange={(v: string) => setBlogSettings((p) => ({ ...p, blogDesc: v }))}
                  rows={2}
                />
              </div>
            </div>

            <div>
              <SectionTitle title="空状态" icon={BookOpen} />
              <div className="space-y-6">
                <FormField
                  label="没有随笔时显示"
                  value={blogSettings.blogEmpty}
                  onChange={(v: string) => setBlogSettings((p) => ({ ...p, blogEmpty: v }))}
                />
              </div>
            </div>
          </div>
        )

      case 'about':
        return (
          <div className="space-y-8">
            {/* 基本信息 */}
            <div>
              <SectionTitle title="页面基本信息" icon={User} />
              <div className="space-y-6">
                <FormField
                  label="小标签"
                  description="大标题上面的英文小字"
                  value={aboutSettings.aboutBadge}
                  onChange={(v: string) => setAboutSettings((p) => ({ ...p, aboutBadge: v }))}
                />
                <FormField
                  label="页面描述"
                  description="大标题下面的描述文字，换行用回车键"
                  value={aboutSettings.aboutPageDesc}
                  onChange={(v: string) => setAboutSettings((p) => ({ ...p, aboutPageDesc: v }))}
                  rows={3}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="标签1"
                    description="地点标签"
                    value={aboutSettings.aboutLocation}
                    onChange={(v: string) => setAboutSettings((p) => ({ ...p, aboutLocation: v }))}
                  />
                  <FormField
                    label="标签2"
                    description="热爱生活标签"
                    value={aboutSettings.aboutLove}
                    onChange={(v: string) => setAboutSettings((p) => ({ ...p, aboutLove: v }))}
                  />
                </div>
                <FormField
                  label="按钮文字"
                  description="跳转到联系页面的按钮"
                  value={aboutSettings.aboutButton}
                  onChange={(v: string) => setAboutSettings((p) => ({ ...p, aboutButton: v }))}
                />
                <FormField
                  label="头像图片 URL"
                  description="关于我页面的头像，留空则不显示"
                  value={aboutSettings.aboutPageImage}
                  onChange={(v: string) => setAboutSettings((p) => ({ ...p, aboutPageImage: v }))}
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
            </div>

            {/* 健身板块 */}
            <div>
              <SectionTitle title="健身板块" icon={Dumbbell} />
              <div className="space-y-6">
                <FormField
                  label="小标签"
                  description="大标题上面的英文小字"
                  value={aboutSettings.fitnessBadge}
                  onChange={(v: string) => setAboutSettings((p) => ({ ...p, fitnessBadge: v }))}
                />
                <FormField
                  label="大标题"
                  value={aboutSettings.fitnessTitle}
                  onChange={(v: string) => setAboutSettings((p) => ({ ...p, fitnessTitle: v }))}
                />
                <FormField
                  label="介绍文字"
                  description="健身板块的介绍，换行用回车键"
                  value={aboutSettings.fitnessDesc}
                  onChange={(v: string) => setAboutSettings((p) => ({ ...p, fitnessDesc: v }))}
                  rows={4}
                />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <FormField
                    label="标签1"
                    value={aboutSettings.fitnessTag1}
                    onChange={(v: string) => setAboutSettings((p) => ({ ...p, fitnessTag1: v }))}
                  />
                  <FormField
                    label="标签2"
                    value={aboutSettings.fitnessTag2}
                    onChange={(v: string) => setAboutSettings((p) => ({ ...p, fitnessTag2: v }))}
                  />
                  <FormField
                    label="标签3"
                    value={aboutSettings.fitnessTag3}
                    onChange={(v: string) => setAboutSettings((p) => ({ ...p, fitnessTag3: v }))}
                  />
                  <FormField
                    label="标签4"
                    value={aboutSettings.fitnessTag4}
                    onChange={(v: string) => setAboutSettings((p) => ({ ...p, fitnessTag4: v }))}
                  />
                  <FormField
                    label="标签5"
                    value={aboutSettings.fitnessTag5}
                    onChange={(v: string) => setAboutSettings((p) => ({ ...p, fitnessTag5: v }))}
                  />
                </div>
                <FormField
                  label="照片区提示文字"
                  description="还没有健身照片时显示的提示"
                  value={aboutSettings.fitnessPhotosPlaceholder}
                  onChange={(v: string) => setAboutSettings((p) => ({ ...p, fitnessPhotosPlaceholder: v }))}
                  rows={2}
                />
              </div>
            </div>

            {/* 兴趣爱好 */}
            <div>
              <SectionTitle title="兴趣爱好" icon={Image} />
              <div className="space-y-6">
                <FormField
                  label="大标题"
                  value={aboutSettings.hobbiesTitle}
                  onChange={(v: string) => setAboutSettings((p) => ({ ...p, hobbiesTitle: v }))}
                />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <FormField
                    label="爱好1"
                    value={aboutSettings.hobby1}
                    onChange={(v: string) => setAboutSettings((p) => ({ ...p, hobby1: v }))}
                  />
                  <FormField
                    label="爱好2"
                    value={aboutSettings.hobby2}
                    onChange={(v: string) => setAboutSettings((p) => ({ ...p, hobby2: v }))}
                  />
                  <FormField
                    label="爱好3"
                    value={aboutSettings.hobby3}
                    onChange={(v: string) => setAboutSettings((p) => ({ ...p, hobby3: v }))}
                  />
                  <FormField
                    label="爱好4"
                    value={aboutSettings.hobby4}
                    onChange={(v: string) => setAboutSettings((p) => ({ ...p, hobby4: v }))}
                  />
                  <FormField
                    label="爱好5"
                    value={aboutSettings.hobby5}
                    onChange={(v: string) => setAboutSettings((p) => ({ ...p, hobby5: v }))}
                  />
                  <FormField
                    label="爱好6"
                    value={aboutSettings.hobby6}
                    onChange={(v: string) => setAboutSettings((p) => ({ ...p, hobby6: v }))}
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 'contact':
        return (
          <div className="space-y-8">
            <div>
              <SectionTitle title="页面标题" icon={Mail} />
              <div className="space-y-6">
                <FormField
                  label="小标签"
                  description="大标题上面的英文小字"
                  value={contactSettings.contactBadge}
                  onChange={(v: string) => setContactSettings((p) => ({ ...p, contactBadge: v }))}
                />
                <FormField
                  label="大标题"
                  value={contactSettings.contactTitle}
                  onChange={(v: string) => setContactSettings((p) => ({ ...p, contactTitle: v }))}
                />
                <FormField
                  label="描述文字"
                  description="大标题下面的描述，换行用回车键"
                  value={contactSettings.contactDesc}
                  onChange={(v: string) => setContactSettings((p) => ({ ...p, contactDesc: v }))}
                  rows={3}
                />
                <FormField
                  label="联系邮箱"
                  description="显示在联系页面的邮箱"
                  value={contactSettings.contactEmail}
                  onChange={(v: string) => setContactSettings((p) => ({ ...p, contactEmail: v }))}
                  type="email"
                />
                <FormField
                  label="小提示文字"
                  description="左下角的小提示框，留空则不显示"
                  value={contactSettings.contactTip}
                  onChange={(v: string) => setContactSettings((p) => ({ ...p, contactTip: v }))}
                  rows={3}
                />
              </div>
            </div>

            <div>
              <SectionTitle title="表单设置" icon={Mail} />
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="姓名输入框提示"
                    value={contactSettings.contactNamePlaceholder}
                    onChange={(v: string) => setContactSettings((p) => ({ ...p, contactNamePlaceholder: v }))}
                  />
                  <FormField
                    label="邮箱输入框提示"
                    value={contactSettings.contactEmailPlaceholder}
                    onChange={(v: string) => setContactSettings((p) => ({ ...p, contactEmailPlaceholder: v }))}
                  />
                </div>
                <FormField
                  label="留言输入框提示"
                  value={contactSettings.contactMessagePlaceholder}
                  onChange={(v: string) => setContactSettings((p) => ({ ...p, contactMessagePlaceholder: v }))}
                  rows={2}
                />
                <FormField
                  label="提交按钮文字"
                  value={contactSettings.contactButton}
                  onChange={(v: string) => setContactSettings((p) => ({ ...p, contactButton: v }))}
                />
                <FormField
                  label="提交成功提示"
                  description="留言发送成功后显示的文字"
                  value={contactSettings.contactSuccess}
                  onChange={(v: string) => setContactSettings((p) => ({ ...p, contactSuccess: v }))}
                  rows={2}
                />
              </div>
            </div>
          </div>
        )

      case 'social':
        return (
          <div className="space-y-6 max-w-lg">
            <p className="text-sm text-muted-foreground mb-4">
              留空的社交链接将不会在网站上显示
            </p>
            <FormField
              label="微博"
              value={socialSettings.weibo}
              onChange={(v: string) => setSocialSettings((p) => ({ ...p, weibo: v }))}
              type="url"
              placeholder="https://weibo.com/yourname"
            />
            <FormField
              label="Instagram"
              value={socialSettings.instagram}
              onChange={(v: string) => setSocialSettings((p) => ({ ...p, instagram: v }))}
              type="url"
              placeholder="https://instagram.com/yourname"
            />
            <FormField
              label="X (Twitter)"
              value={socialSettings.x}
              onChange={(v: string) => setSocialSettings((p) => ({ ...p, x: v }))}
              type="url"
              placeholder="https://x.com/yourname"
            />
            <FormField
              label="GitHub"
              value={socialSettings.github}
              onChange={(v: string) => setSocialSettings((p) => ({ ...p, github: v }))}
              type="url"
              placeholder="https://github.com/yourname"
            />
          </div>
        )

      case 'password':
        return (
          <div className="space-y-6 max-w-md">
            <FormField
              label="当前密码"
              value={passwordSettings.currentPassword}
              onChange={(v: string) => setPasswordSettings((p) => ({ ...p, currentPassword: v }))}
              type="password"
              placeholder="请输入当前密码"
            />
            <FormField
              label="新密码"
              description="至少6位"
              value={passwordSettings.newPassword}
              onChange={(v: string) => setPasswordSettings((p) => ({ ...p, newPassword: v }))}
              type="password"
              placeholder="请输入新密码"
            />
            <FormField
              label="确认新密码"
              value={passwordSettings.confirmPassword}
              onChange={(v: string) => setPasswordSettings((p) => ({ ...p, confirmPassword: v }))}
              type="password"
              placeholder="请再次输入新密码"
            />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">网站设置</h1>
          <p className="text-muted-foreground">管理你的网站所有文字和内容</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving || loading}
          className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>保存中...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>保存设置</span>
            </>
          )}
        </button>
      </div>

      {/* 保存成功提示 */}
      {saveSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-500 text-center"
        >
          ✓ 设置保存成功！刷新网页即可看到效果
        </motion.div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* 侧边栏标签 */}
        <div className="lg:w-56 shrink-0">
          <div className="bg-card/50 rounded-xl border border-white/10 p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-left ${
                    activeTab === tab.id
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* 内容区域 */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-card/50 rounded-xl border border-white/10 p-6"
          >
            {renderTabContent()}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default AdminSettings
