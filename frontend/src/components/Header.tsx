import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, X, Music } from 'lucide-react'
import { cn } from '@/lib/utils'
import { settingsApi } from '@/lib/api'
import type { SiteSettings } from '@/types'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [settingsLoading, setSettingsLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location])

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await settingsApi.get()
      const s: any = res.settings
      setSettings({
        siteName: s.site_name || 'Peter 的小世界',
        siteDescription: s.site_description || '',
        navHome: s.nav_home || '首页',
        navAlbum: s.nav_album || '相册',
        navBlog: s.nav_blog || '生活随笔',
        navAbout: s.nav_about || '关于我',
        navContact: s.nav_contact || '联系我',
        footerCopyright: s.footer_copyright || '',
        heroBadge: s.hero_badge || '',
        heroTitle: s.hero_title || '',
        heroSubtitle: s.hero_subtitle || '',
        heroButton1: s.hero_button1 || '',
        heroButton2: s.hero_button2 || '',
        heroImage: s.hero_image || '',
        featuredPhotosBadge: s.featured_photos_badge || '',
        featuredPhotosTitle: s.featured_photos_title || '',
        featuredPhotosDesc: s.featured_photos_desc || '',
        featuredPhotosViewAll: s.featured_photos_view_all || '',
        recentPostsBadge: s.recent_posts_badge || '',
        recentPostsTitle: s.recent_posts_title || '',
        recentPostsDesc: s.recent_posts_desc || '',
        recentPostsViewAll: s.recent_posts_view_all || '',
        musicBadge: s.music_badge || '',
        musicSectionTitle: s.music_section_title || '',
        musicSectionDescription: s.music_section_description || '',
        musicButton: s.music_button || '',
        aboutTitle: s.about_title || '',
        aboutContent: s.about_content || '',
        aboutImage: s.about_image || '',
        aboutPreviewButton: s.about_preview_button || '',
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
        blogBadge: s.blog_badge || '',
        blogTitle: s.blog_title || '',
        blogDesc: s.blog_desc || '',
        blogEmpty: s.blog_empty || '',
        aboutBadge: s.about_badge || '',
        aboutPageDesc: s.about_page_desc || '',
        aboutLocation: s.about_location || '',
        aboutLove: s.about_love || '',
        aboutButton: s.about_button || '',
        aboutPageImage: s.about_page_image || '',
        fitnessBadge: s.fitness_badge || '',
        fitnessTitle: s.fitness_title || '',
        fitnessDesc: s.fitness_desc || '',
        fitnessTag1: s.fitness_tag_1 || '',
        fitnessTag2: s.fitness_tag_2 || '',
        fitnessTag3: s.fitness_tag_3 || '',
        fitnessTag4: s.fitness_tag_4 || '',
        fitnessTag5: s.fitness_tag_5 || '',
        fitnessPhotosPlaceholder: s.fitness_photos_placeholder || '',
        hobbiesTitle: s.hobbies_title || '',
        hobby1: s.hobby_1 || '',
        hobby2: s.hobby_2 || '',
        hobby3: s.hobby_3 || '',
        hobby4: s.hobby_4 || '',
        hobby5: s.hobby_5 || '',
        hobby6: s.hobby_6 || '',
        contactBadge: s.contact_badge || '',
        contactTitle: s.contact_title || '',
        contactDesc: s.contact_desc || '',
        contactEmail: s.contact_email || '',
        contactNamePlaceholder: s.contact_name_placeholder || '',
        contactEmailPlaceholder: s.contact_email_placeholder || '',
        contactMessagePlaceholder: s.contact_message_placeholder || '',
        contactButton: s.contact_button || '',
        contactSuccess: s.contact_success || '',
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

  const navLinks = [
    { name: settings?.navHome || '首页', path: '/' },
    { name: settings?.navAlbum || '相册', path: '/portfolio' },
    { name: settings?.navBlog || '生活随笔', path: '/blog' },
    { name: settings?.navAbout || '关于我', path: '/about' },
    { name: settings?.navContact || '联系我', path: '/contact' },
  ]

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: settingsLoading ? 0 : 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-background/80 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl md:text-2xl font-bold gradient-text">
              {settings?.siteName || 'Peter 的小世界'}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'text-sm font-medium transition-colors duration-200 hover:text-primary',
                  location.pathname === link.path
                    ? 'text-primary'
                    : 'text-foreground/80'
                )}
              >
                {link.name}
              </Link>
            ))}
            <button
              onClick={() => {
                const event = new CustomEvent('toggleMusic')
                window.dispatchEvent(event)
              }}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="音乐播放器"
            >
              <Music className="w-5 h-5 text-primary" />
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="菜单"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'md:hidden transition-all duration-300 overflow-hidden',
          isMobileMenuOpen ? 'max-h-96' : 'max-h-0'
        )}
      >
        <div className="bg-background/95 backdrop-blur-md border-t border-white/10 px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'block px-4 py-3 rounded-lg text-base font-medium transition-colors',
                location.pathname === link.path
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-white/5'
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </motion.header>
  )
}

export default Header
