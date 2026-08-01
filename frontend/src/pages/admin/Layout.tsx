import { useState, useEffect } from 'react'
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Image,
  Music,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const AdminLayout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    navigate('/admin/login')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  const menuItems = [
    { path: '/admin', label: '仪表盘', icon: LayoutDashboard },
    { path: '/admin/photos', label: '照片管理', icon: Image },
    { path: '/admin/music', label: '音乐管理', icon: Music },
    { path: '/admin/blog', label: '随笔管理', icon: FileText },
    { path: '/admin/settings', label: '网站设置', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-background flex">
      {/* 侧边栏 */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-white/10 transition-transform duration-300',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <h1 className="text-xl font-bold gradient-text">管理后台</h1>
            <p className="text-sm text-muted-foreground mt-1">Peter 的小世界</p>
          </div>

          {/* 导航菜单 */}
          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <a
                  key={item.path}
                  href={item.path}
                  onClick={(e) => {
                    e.preventDefault()
                    navigate(item.path)
                  }}
                  className={cn(
                    'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </a>
              )
            })}
          </nav>

          {/* 底部按钮 */}
          <div className="p-4 border-t border-white/10 space-y-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground transition-colors"
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">查看网站</span>
            </a>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">退出登录</span>
            </button>
          </div>
        </div>
      </aside>

      {/* 主内容区 */}
      <div
        className={cn(
          'flex-1 transition-all duration-300',
          isSidebarOpen ? 'ml-64' : 'ml-0'
        )}
      >
        {/* 顶部栏 */}
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-white/10">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              {isSidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">欢迎回来，Peter</span>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-white font-medium text-sm">
                P
              </div>
            </div>
          </div>
        </header>

        {/* 页面内容 */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
