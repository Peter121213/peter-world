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
import { settingsApi, authApi } from '@/lib/api'

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general')
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [loading, setLoading] = useState(true)

  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'Peter 鐨勫皬涓栫晫',
    siteDescription: '鐢ㄩ暅澶磋褰曠編濂斤紝鐢ㄩ煶涔愪紶閫掓儏鎰?,
  })

  const [heroSettings, setHeroSettings] = useState({
    heroTitle: '',
    heroSubtitle: '',
    heroImage: '',
  })

  const [profileSettings, setProfileSettings] = useState({
    aboutTitle: '鍏充簬鎴?,
    aboutContent: '',
    aboutImage: '',
    aboutPageImage: '',
    email: '',
  })

  const [musicSettings, setMusicSettings] = useState({
    musicSectionTitle: '闊充箰闄即',
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
    { id: 'general', label: '鍩烘湰璁剧疆', icon: Globe },
    { id: 'hero', label: '棣栭〉 Hero', icon: Image },
    { id: 'profile', label: '涓汉璧勬枡', icon: User },
    { id: 'music', label: '闊充箰鍖哄煙', icon: Music },
    { id: 'social', label: '绀句氦閾炬帴', icon: Link },
    { id: 'password', label: '淇敼瀵嗙爜', icon: Lock },
  ]

  // 椤甸潰鍔犺浇鏃惰幏鍙栬缃?
  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const res = await settingsApi.get()
      const settings: any = res.settings

      setGeneralSettings({
        siteName: settings.site_name || 'Peter 鐨勫皬涓栫晫',
        siteDescription: settings.site_description || '',
      })

      setHeroSettings({
        heroTitle: settings.hero_title || '',
        heroSubtitle: settings.hero_subtitle || '',
        heroImage: settings.hero_image || '',
      })

      setProfileSettings({
        aboutTitle: settings.about_title || '鍏充簬鎴?,
        aboutContent: settings.about_content || '',
        aboutImage: settings.about_image || '',
        aboutPageImage: settings.about_page_image || '',
        email: settings.contact_email || '',
      })

      setMusicSettings({
        musicSectionTitle: settings.music_section_title || '闊充箰闄即',
        musicSectionDescription: settings.music_section_description || '',
      })

      setSocialSettings({
        weibo: settings.social_weibo || '',
        instagram: settings.social_instagram || '',
        x: settings.social_x || '',
        github: settings.social_github || '',
      })
    } catch (error) {
      console.error('鑾峰彇璁剧疆澶辫触:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaveSuccess(false)

    try {
      // 鏍规嵁褰撳墠鏍囩椤典繚瀛樹笉鍚岀殑璁剧疆
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
        // 淇敼瀵嗙爜鍔熻兘鏆傛湭瀹炵幇
        alert('淇敼瀵嗙爜鍔熻兘寮€鍙戜腑锛屾暚璇锋湡寰?)
        setIsSaving(false)
        return
      }

      await settingsApi.update(settingsToSave)

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.error('淇濆瓨璁剧疆澶辫触:', error)
      alert('淇濆瓨澶辫触锛岃閲嶈瘯')
    } finally {
      setIsSaving(false)
    }
  }

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="text-center py-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">鍔犺浇涓?..</p>
        </div>
      )
    }

    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                缃戠珯鍚嶇О
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
                缃戠珯鎻忚堪
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
                Hero 鏍囬锛堢敤 \n 鎹㈣锛?
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
                Hero 鍓爣棰橈紙鐢?\n 鎹㈣锛?
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
                Hero 鑳屾櫙鍥剧墖 URL
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
                鍙互鍏堝湪"鐓х墖绠＄悊"涓婁紶鍥剧墖锛岀劧鍚庡鍒跺浘鐗囬摼鎺ョ矘璐村埌杩欓噷
              </p>
            </div>
          </div>
        )

      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                鍏充簬鎴戞爣棰?
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
                涓汉绠€浠嬶紙鐢ㄦ崲琛屽垎娈碉級
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
                棣栭〉鍏充簬鎴戝浘鐗?URL
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
                鍏充簬鎴戦〉闈㈠ご鍍?URL
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
                鍙互鍏堝湪"鐓х墖绠＄悊"涓婁紶鍥剧墖锛岀劧鍚庡鍒跺浘鐗囬摼鎺ョ矘璐村埌杩欓噷
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">鑱旂郴閭</label>
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
                闊充箰鍖哄煙鏍囬
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
                闊充箰鍖哄煙鎻忚堪锛堢敤 \n 鎹㈣锛?
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
              <label className="block text-sm font-medium mb-2">寰崥</label>
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
              鐣欑┖鐨勭ぞ浜ら摼鎺ュ皢涓嶄細鍦ㄧ綉绔欎笂鏄剧ず
            </p>
          </div>
        )

      case 'password':
        return (
          <div className="space-y-6 max-w-md">
            <div>
              <label className="block text-sm font-medium mb-2">
                褰撳墠瀵嗙爜
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
                placeholder="璇疯緭鍏ュ綋鍓嶅瘑鐮?
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">鏂板瘑鐮?/label>
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
                placeholder="璇疯緭鍏ユ柊瀵嗙爜"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                纭鏂板瘑鐮?
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
                placeholder="璇峰啀娆¤緭鍏ユ柊瀵嗙爜"
              />
            </div>
            
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* 椤甸潰鏍囬 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">缃戠珯璁剧疆</h1>
          <p className="text-muted-foreground">绠＄悊浣犵殑缃戠珯鍩烘湰淇℃伅</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving || loading}
          className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>淇濆瓨涓?..</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>淇濆瓨璁剧疆</span>
            </>
          )}
        </button>
      </div>

      {/* 淇濆瓨鎴愬姛鎻愮ず */}
      {saveSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-500 text-center"
        >
          鉁?璁剧疆淇濆瓨鎴愬姛锛?
        </motion.div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* 渚ц竟鏍忔爣绛?*/}
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

        {/* 鍐呭鍖哄煙 */}
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

