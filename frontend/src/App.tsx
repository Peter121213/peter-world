import { Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SettingsProvider, useSettings } from './contexts/SettingsContext'
import Header from './components/Header'
import Footer from './components/Footer'
import MusicPlayer from './components/MusicPlayer'
import Home from './pages/Home'
import Portfolio from './pages/Portfolio'
import Blog from './pages/Blog'
import About from './pages/About'
import Contact from './pages/Contact'
import AdminLogin from './pages/admin/Login'
import AdminDashboard from './pages/admin/Dashboard'
import AdminPhotos from './pages/admin/Photos'
import AdminMusic from './pages/admin/Music'
import AdminBlog from './pages/admin/Blog'
import AdminSettings from './pages/admin/Settings'
import AdminLayout from './pages/admin/Layout'

// 前台布局 - 带全局淡入效果
const FrontendLayout = () => {
  const { loading } = useSettings()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: loading ? 0 : 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col min-h-screen"
    >
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
      <MusicPlayer />
    </motion.div>
  )
}

function App() {
  return (
    <SettingsProvider>
      <div className="min-h-screen bg-background text-foreground font-sans">
        <Routes>
          {/* 管理后台路由 */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="photos" element={<AdminPhotos />} />
            <Route path="music" element={<AdminMusic />} />
            <Route path="blog" element={<AdminBlog />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* 前台路由 */}
          <Route path="/*" element={<FrontendLayout />} />
        </Routes>
      </div>
    </SettingsProvider>
  )
}

export default App
