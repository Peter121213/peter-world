import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { authApi } from '@/lib/api'

const AdminLogin = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  const from = (location.state as any)?.from?.pathname || '/admin'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const res = await authApi.login(username, password)
      
      if (res.token) {
        // 同时存在 localStorage 和 cookie 里
        localStorage.setItem('admin_token', res.token)
        
        // 设置 cookie（7 天过期）；encode 避免特殊字符破坏解析
        const days = 7
        const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString()
        document.cookie = `peter_world_token=${encodeURIComponent(res.token)}; expires=${expires}; path=/; SameSite=Lax`
        
        navigate(from, { replace: true })
      } else {
        setError('登录失败，请重试')
      }
    } catch (err: any) {
      setError(err.message || '用户名或密码错误')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Logo 和标题 */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-block mb-4">
            <h1 className="text-3xl font-bold gradient-text">Peter 的小世界</h1>
          </Link>
          <h2 className="text-2xl font-bold mb-2">管理后台登录</h2>
          <p className="text-muted-foreground">请输入您的账号信息</p>
        </div>

        {/* 登录表单 */}
        <div className="bg-card/50 rounded-2xl p-8 border border-white/10 shadow-2xl">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 用户名 */}
            <div>
              <label className="block text-sm font-medium mb-2">用户名</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-background/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors"
                  placeholder="请输入用户名"
                />
              </div>
            </div>

            {/* 密码 */}
            <div>
              <label className="block text-sm font-medium mb-2">密码</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-11 py-3 bg-background/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors"
                  placeholder="请输入密码"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* 登录按钮 */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>登录中...</span>
                </>
              ) : (
                <>
                  <span>登录</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* 提示信息 */}
          <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/10">
            <p className="text-sm text-muted-foreground text-center">
              💡 默认账号：<span className="text-primary font-medium">admin</span> /{' '}
              <span className="text-primary font-medium">admin123</span>
            </p>
            <p className="text-xs text-muted-foreground/70 text-center mt-2">
              登录后请及时修改密码
            </p>
          </div>
        </div>

        {/* 返回首页 */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            ← 返回网站首页
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default AdminLogin
