import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Settings as SettingsIcon,
  Save,
  User,
  Lock,
  Globe,
  Image,
  Link,
} from 'lucide-react'

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general')
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'Peter 的小世界',
    siteDescription: '用镜头记录美好，用音乐传递情感',
    heroTitle: '欢迎来到我的小世界',
    heroSubtitle: '这里有一些我的生活碎片和喜欢的音乐\n随便坐坐，听听歌，看看照片',
  })

  const [profileSettings, setProfileSettings] = useState({
    aboutTitle: '关于我',
    aboutContent:
      '你好，我是 Peter，一个热爱摄影和音乐的普通人。我喜欢用镜头记录生活中的美好瞬间，也喜欢用音乐表达内心的情感。',
    location: '中国 · 成都',
    email: 'hello@peter.world',
  })

  const [socialSettings, setSocialSettings] = useState({
    weibo: '',
    instagram: '',
    twitter: '',
    github: '',
  })

  const [passwordSettings, setPasswordSettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const tabs = [
    { id: 'general', label: '基本设置', icon: Globe },
    { id: 'profile', label: '个人资料', icon: User },
    { id: 'social', label: '社交链接', icon: Link },
    { id: 'password', label: '修改密码', icon: Lock },
  ]

  const handleSave = async () => {
    setIsSaving(true)
    setSaveSuccess(false)

    // 模拟保存
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSaving(false)
    setSaveSuccess(true)

    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const renderTabContent = () => {
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
            <div>
              <label className="block text-sm font-medium mb-2">
                首页大标题
              </label>
              <input
                type="text"
                value={generalSettings.heroTitle}
                onChange={(e) =>
                  setGeneralSettings((prev) => ({
                    ...prev,
                    heroTitle: e.target.value,
                  }))
                }
                className="w-full px-4 py-2.5 bg-background/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                首页副标题
              </label>
              <textarea
                value={generalSettings.heroSubtitle}
                onChange={(e) =>
                  setGeneralSettings((prev) => ({
                    ...prev,
                    heroSubtitle: e.target.value,
                  }))
                }
                rows={3}
                className="w-full px-4 py-2.5 bg-background/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors resize-none"
              />
              <p className="text-xs text-muted-foreground mt-2">
                每行显示一行文字
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
                个人简介
              </label>
              <textarea
                value={profileSettings.aboutContent}
                onChange={(e) =>
                  setProfileSettings((prev) => ({
                    ...prev,
                    aboutContent: e.target.value,
                  }))
                }
                rows={5}
                className="w-full px-4 py-2.5 bg-background/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">所在地</label>
              <input
                type="text"
                value={profileSettings.location}
                onChange={(e) =>
                  setProfileSettings((prev) => ({
                    ...prev,
                    location: e.target.value,
                  }))
                }
                className="w-full px-4 py-2.5 bg-background/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors"
              />
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
            <div>
              <label className="block text-sm font-medium mb-2">
                个人头像
              </label>
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-white text-2xl font-bold">
                  P
                </div>
                <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-colors">
                  更换头像
                </button>
              </div>
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
              <label className="block text-sm font-medium mb-2">Twitter</label>
              <input
                type="url"
                value={socialSettings.twitter}
                onChange={(e) =>
                  setSocialSettings((prev) => ({
                    ...prev,
                    twitter: e.target.value,
                  }))
                }
                placeholder="https://twitter.com/yourname"
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
                ⚠️ 密码长度至少 8 位，建议包含字母、数字和特殊字符
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
          disabled={isSaving}
          className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
