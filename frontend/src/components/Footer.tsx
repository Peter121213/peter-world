import { Github, Instagram, Mail, Heart } from 'lucide-react'
import { useSettings } from '@/contexts/SettingsContext'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const { settings } = useSettings()

  // X (Twitter) 图标
  const XIcon = () => (
    <svg
      viewBox="0 0 24 24"
      className="w-5 h-5"
      fill="currentColor"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )

  // 微博图标
  const WeiboIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M10.098 20.323c-3.977.391-7.414-1.406-7.672-4.02-.259-2.609 2.759-5.047 6.74-5.441 3.979-.394 7.413 1.404 7.671 4.018.259 2.6-2.759 5.049-6.739 5.443zM9.05 17.219c-.384.616-1.208.884-1.829.602-.612-.279-.793-.991-.406-1.593.379-.595 1.176-.861 1.793-.601.622.263.82.972.442 1.592zm1.27-1.627c-.141.237-.449.353-.689.253-.236-.09-.313-.361-.177-.586.138-.227.436-.346.672-.24.239.09.315.36.194.573zm.176-2.719c-1.893-.493-4.033.45-4.857 2.118-.836 1.704-.026 3.591 1.886 4.21 1.983.64 4.318-.341 5.132-2.179.8-1.793-.201-3.642-2.161-4.149zm7.563-1.224c-.346-.105-.57-.18-.405-.649.359-1.017.389-1.891.003-2.521-.722-1.177-2.69-1.112-4.986-.033 0 0-.712.309-.529-.254.354-1.147.288-2.112-.274-2.643-1.264-1.186-4.372.043-6.942 2.742C2.903 10.935 1.5 13.546 1.5 15.83c0 4.29 5.109 6.866 10.142 6.866 6.529 0 10.822-3.878 10.822-6.948 0-1.852-1.563-2.9-3.405-3.405-.654-.181-1.313-.284-1.97-.353z"/>
    </svg>
  )

  const socialLinks = settings?.socialLinks || {
    weibo: '',
    instagram: '',
    x: '',
    github: '',
    email: '',
  }

  const socialList = [
    { name: 'Instagram', icon: Instagram, url: socialLinks.instagram, color: 'hover:text-pink-500', show: !!socialLinks.instagram },
    { name: 'X', icon: XIcon, url: socialLinks.x, color: 'hover:text-blue-400', show: !!socialLinks.x },
    { name: '微博', icon: WeiboIcon, url: socialLinks.weibo, color: 'hover:text-red-500', show: !!socialLinks.weibo },
    { name: 'GitHub', icon: Github, url: socialLinks.github, color: 'hover:text-gray-300', show: !!socialLinks.github },
  ].filter(item => item.show)

  return (
    <footer className="bg-card/50 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 品牌信息 */}
          <div>
            <h3 className="text-xl font-bold gradient-text mb-4">
              {settings?.siteName || 'Peter 的小世界'}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {settings?.siteDescription || '用镜头记录美好，用音乐传递情感。'}
            </p>
          </div>

          {/* 快速链接 */}
          <div>
            <h4 className="text-lg font-semibold mb-4">快速链接</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/" className="hover:text-primary transition-colors">
                  {settings?.navHome || '首页'}
                </a>
              </li>
              <li>
                <a href="/portfolio" className="hover:text-primary transition-colors">
                  {settings?.navAlbum || '相册'}
                </a>
              </li>
              <li>
                <a href="/blog" className="hover:text-primary transition-colors">
                  {settings?.navBlog || '生活随笔'}
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-primary transition-colors">
                  {settings?.navAbout || '关于我'}
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-primary transition-colors">
                  {settings?.navContact || '联系我'}
                </a>
              </li>
            </ul>
          </div>

          {/* 社交媒体 */}
          <div>
            <h4 className="text-lg font-semibold mb-4">社交媒体</h4>
            <div className="flex space-x-4">
              {socialList.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-muted-foreground transition-colors ${social.color}`}
                  title={social.name}
                >
                  <social.icon />
                </a>
              ))}
              {socialLinks.email && (
                <a
                  href={`mailto:${socialLinks.email}`}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  title="邮箱"
                >
                  <Mail className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* 版权信息 */}
        <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center space-x-1">
            <span>
              {(settings?.footerCopyright || '© {year} Peter 的小世界. All rights reserved.').replace('{year}', currentYear.toString())}
            </span>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
