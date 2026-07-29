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
  Loader2,
} from 'lucide-react'
import { settingsApi } from '@/lib/api'

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general')
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [loading, setLoading] = useState(true)

  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'Peter 的小世界',
    siteDescription: '用镜头记录美好，用音乐传递情感',
  })

  const [heroSettings, setHeroSettings] = useState({
    heroTitle: '',
    heroSubtitle: '',
    heroImage: '',
  })

  const [profileSettings, setProfileSettings] = useState({
    aboutTitle: '关于我',
    aboutContent: '',
    aboutImage: '',
    aboutPageImage: '',
    email: '',
  })

  const [musicSettings, setMusicSettings] = useState({
    musicSectionTitle: '音乐陪伴',
    musicSectionDescription: '',
  })

  const [socialSettings, setSocialSettings] = useState({
    weibo: '',
    instagram: '',
    x: '',
    github: '',
  })

  const [passwordSettings, setPasswordSettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const tabs = [
    { id: 'general', label: '基本设置', icon: Globe },
    { id: 'hero', label: '首页 Hero', icon: Image },
    { id: 'profile', label: '个人资料', icon: User },
    { id: 'music', label: '音乐区域', icon: Music },
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
      const settings: any = res.settings

      setGeneralSettings({
        siteName: settings.site_name || 'Peter 的小世界',
        siteDescription: settings.site_description || '',
      })

      setHeroSettings({
        heroTitle: settings.hero_title || '',
        heroSubtitle: settings.hero_subtitle || '',
        heroImage: settings.hero_image || '',
      })

      setProfileSettings({
        aboutTitle: settings.about_title || '关于我',
        aboutContent: settings.about_content || '',
        aboutImage: settings.about_image || '',
        aboutPageImage: settings.about_page_image || '',
        email: settings.contact_email || '',
      })

      setMusicSettings({
        musicSectionTitle: settings.music_section_title || '音乐陪伴',
        musicSectionDescription: settings.music_section_description || '',
      })

      setSocialSettings({
        weibo: settings.social_weibo || '',
        instagram: settings.social_instagram || '',
        x: settings.social_x || '',
        github: settings.social_github || '',
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
      // 根据当前标签页保存不同的设置
      let settingsToSave: any = {}

      if (activeTab === 'general') {
        settingsToSave = {
          site_name: generalSettings.siteName,
          site_description: generalSettings.siteDescription,
        }
      } else if (activeTab === 'hero') {
        settingsToSave = {
          hero_title: heroSettings.heroTitle,
          hero_subtitle: heroSettings.heroSubtitle,
          hero_image: heroSettings.heroImage,
        }
      } else if (activeTab === 'profile') {
        settingsToSave = {
          about_title: profileSettings.aboutTitle,
          about_content: profileSettings.aboutContent,
          about_image: profileSettings.aboutImage,
          about_page_image: profileSettings.aboutPageImage,
          contact_email: profileSettings.email,
        }
      } else if (activeTab === 'music') {
        settingsToSave = {
          music_section_title: musicSettings.musicSectionTitle,
          music_section_description: musicSettings.musicSectionDescription,
        }
      } else if (activeTab === 'social') {
        settingsToSave = {
          social_weibo: socialSettings.weibo,
          social_instagram: socialSettings.instagram,
          social_x: socialSettings.x,
          social_github: socialSettings.github,
        }
      } else if (activeTab === 'password') {
        // 修改密码功能暂未实现
        alert('修改密码功能开发中，敬请期待')
        setIsSaving(false)
        return
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
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                网站名称
              </label>
              <input
                type="text"
                value={generalSettings.siteName}
                onChange={(e) =>
                  setGeneralSettings((prev) => ({
                    ...prev,
                    siteName: e.target.value,
                  }))
                }
                className="w-full px-4 py-2.5 bg-background/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                网站描述
              </label>
              <textarea
                value={generalSettings.siteDescription}
                onChange={(e) =>
                  setGeneralSettings((prev) => ({
                    ...prev,
                    siteDescription: e.target.value,
                  }))
                }
                rows={2}
                className="w-full px-4 py-2.5 bg-background/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </div>
          </div>
        )

      case 'hero':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Hero 标题（用 \n 换行）
              </label>
              <textarea
                value={heroSettings.heroTitle}
                onChange={(e) =>
                  setHeroSettings((prev) => ({
                    ...prev,
                    heroTitle: e.target.value,
                  }))
                }
                rows={3}
                className="w-full px-4 py-2.5 bg-background/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Hero 副标题（用 \n 换行）
              </label>
              <textarea
                value={heroSettings.heroSubtitle}
                onChange={(e) =>
                  setHeroSettings((prev) => ({
                    ...prev,
                    heroSubtitle: e.target.value,
                  }))
                }
                rows={3}
                className="w-full px-4 py-2.5 bg-background/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Hero 背景图片 URL
              </label>
              <input
                type="url"
                value={heroSettings.heroImage}
                onChange={(e) =>
                  setHeroSettings((prev) => ({
                    ...prev,
                    heroImage: e.target.value,
                  }))
                }
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-2.5 bg-background/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors"
              />
              <p className="text-xs text-muted-foreground mt-2">
                可以先在"照片管理"上传图片，然后复制图片链接粘贴到这里
              </p>
            </div>
          </div>
        )

      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                关于我标题
              </label>
              <input
                type="text"
                value={profileSettings.aboutTitle}
                onChange={(e) =>
                  setProfileSettings((prev) => ({
                    ...prev,
                    aboutTitle: e.target.value,
                  }))
                }
                className="w-full px-4 py-2.5 bg-background/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                个人简介（用换行分段）
              </label>
              <textarea
                value={profileSettings.aboutContent}
                onChange={(e) =>
                  setProfileSettings((prev) => ({
                    ...prev,
                    aboutContent: e.target.value,
                  }))
                }
                rows={8}
                className="w-full px-4 py-2.5 bg-background/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                首页关于我图片 URL
              </label>
              <input
                type="url"
                value={profileSettings.aboutImage}
                onChange={(e) =>
                  setProfileSettings((prev) => ({
                    ...prev,
                    aboutImage: e.target.value,
                  }))
                }
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-2.5 bg-background/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                关于我页面头像 URL
              </label>
              <input
                type="url"
                value={profileSettings.aboutPageImage}
                onChange={(e) =>
                  setProfileSettings((prev) => ({
                    ...prev,
                    aboutPageImage: e.target.value,
                  }))
                }
                placeholder="https://example.com/avatar.jpg"
                className="w-full px-4 py-2.5 bg-background/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors"
              />
              <p className="text-xs text-muted-foreground mt-2">
                可以先在"照片管理"上传图片，然后复制图片链接粘贴到这里
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">联系邮箱</label>
              <input
                type="email"
                value={profileSettings.email}
                onChange={(e) =>
                  setProfileSettings((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                className="w-full px-4 py-2.5 bg-background/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
        )

      case 'music':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                音乐区域标题
              </label>
              <input
                type="text"
                value={musicSettings.musicSectionTitle}
                onChange={(e) =>
                  setMusicSettings((prev) => ({
                    ...prev,
                    musicSectionTitle: e.target.value,
                  }))
                }
                className="w-full px-4 py-2.5 bg-background/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                音乐区域描述（用 \n 换行）
              </label>
              <textarea
                value={musicSettings.musicSectionDescription}
                onChange={(e) =>
                  setMusicSettings((prev) => ({
                    ...prev,
                    musicSectionDescription: e.target.value,
                  }))
                }
                rows={3}
                className="w-full px-4 py-2.5 bg-background/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </div>
          </div>
        )

      case 'social':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">微博</label>
              <input
                type="url"
                value={socialSettings.weibo}
                onChange={(e) =>
                  setSocialSettings((prev) => ({
                    ...prev,
                    weibo: e.target.value,
                  }))
                }
                placeholder="https://weibo.com/yourname"
                className="w-full px-4 py-2.5 bg-background/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Instagram</label>
              <input
                type="url"
                value={socialSettings.instagram}
                onChange={(e) =>
                  setSocialSettings((prev) => ({
                    ...prev,
                    instagram: e.target.value,
                  }))
                }
                placeholder="https://instagram.com/yourname"
                className="w-full px-4 py-2.5 bg-background/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">X (Twitter)</label>
              <input
                type="url"
                value={socialSettings.x}
                onChange={(e) =>
                  setSocialSettings((prev) => ({
                    ...prev,
                    x: e.target.value,
                  }))
                }
                placeholder="https://x.com/yourname"
                className="w-full px-4 py-2.5 bg-background/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">GitHub</label>
              <input
                type="url"
                value={socialSettings.github}
                onChange={(e) =>
                  setSocialSettings((prev) => ({
                    ...prev,
                    github: e.target.value,
                  }))
                }
                placeholder="https://github.com/yourname"
                className="w-full px-4 py-2.5 bg-background/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              留空的社交链接将不会在网站上显示
            </p>
          </div>
        )

      case 'password':
        return (
          <div className="space-y-6 max-w-md">
            <div>
              <label className="block text-sm font-medium mb-2">
                当前密码
              </label>
              <input
                type="password"
                value={passwordSettings.currentPassword}
                onChange={(e) =>
                  setPasswordSettings((prev) => ({
                    ...prev,
                    currentPassword: e.target.value,
                  }))
                }
                className="w-full px-4 py-2.5 bg-background/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors"
                placeholder="请输入当前密码"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">新密码</label>
              <input
                type="password"
                value={passwordSettings.newPassword}
                onChange={(e) =>
                  setPasswordSettings((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
                className="w-full px-4 py-2.5 bg-background/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors"
                placeholder="请输入新密码"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                确认新密码
              </label>
              <input
                type="password"
                value={passwordSettings.confirmPassword}
                onChange={(e) =>
                  setPasswordSettings((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                className="w-full px-4 py-2.5 bg-background/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors"
                placeholder="请再次输入新密码"
              />
            </div>
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p className="text-sm text-yellow-500">
                ⚠️ 修改密码功能开发中，敬请期待
              </p>
            </div>
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
          <p className="text-muted-foreground">管理你的网站基本信息</p>
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
          ✓ 设置保存成功！
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
