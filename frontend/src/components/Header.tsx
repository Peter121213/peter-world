import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Music } from 'lucide-react'
import { cn } from '@/lib/utils'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
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

  const navLinks = [
    { name: '首页', path: '/' },
    { name: '作品集', path: '/portfolio' },
    { name: '关于我', path: '/about' },
    { name: '联系我', path: '/contact' },
  ]

  return (
    <header
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
              Peter 的小世界
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
    </header>
  )
}

export default Header
