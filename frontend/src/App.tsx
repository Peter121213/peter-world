import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import MusicPlayer from './components/MusicPlayer'
import Home from './pages/Home'
import Portfolio from './pages/Portfolio'
import About from './pages/About'
import Contact from './pages/Contact'
import AdminLogin from './pages/admin/Login'
import AdminDashboard from './pages/admin/Dashboard'
import AdminPhotos from './pages/admin/Photos'
import AdminMusic from './pages/admin/Music'
import AdminSettings from './pages/admin/Settings'
import AdminLayout from './pages/admin/Layout'

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Routes>
        {/* 管理后台路由 */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="photos" element={<AdminPhotos />} />
          <Route path="music" element={<AdminMusic />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* 前台路由 */}
        <Route
          path="/*"
          element={
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/portfolio" element={<Portfolio />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                </Routes>
              </main>
              <Footer />
              <MusicPlayer />
            </div>
          }
        />
      </Routes>
    </div>
  )
}

export default App
