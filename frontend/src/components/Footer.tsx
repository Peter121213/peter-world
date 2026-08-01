import { useState, useEffect } from 'react'
import { Github, Instagram, Mail, Heart } from 'lucide-react'
import { settingsApi } from '@/lib/api'
import type { SiteSettings } from '@/types'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const [settings, setSettings] = useState<SiteSettings | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await settingsApi.get()
      const s: any = res.settings
      setSettings({
        siteName: s.site_name || 'Peter 的小世界',
        siteDescription: s.site_description || '用镜头记录美好，用音乐传递情感。',
        navHome: s.nav_home || '首页',
        navAlbum: s.nav_album || '相册',
        navBlog: s.nav_blog || '生活随笔',
        navAbout: s.nav_about || '关于我',
        navContact: s.nav_contact || '联系我',
        footerCopyright: s.footer_copyright || '© {year} Peter 的小世界. All rights reserved.',
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
    }
  }

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
                <a
                  href="/portfolio"
                  className="hover:text-primary transition-colors"
                >
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
                <a
                  href="/contact"
                  className="hover:text-primary transition-colors"
                >
                  {settings?.navContact || '联系我'}
                </a>
              </li>
            </ul>
          </div>

          {/* 社交媒体 */}
          <div>
            <h4 className="text-lg font-semibold mb-4">关注我</h4>
            <div className="flex space-x-4">
              {socialLinks.weibo && (
                <a
                  href={socialLinks.weibo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/5 hover:bg-primary/20 hover:text-primary transition-all"
                  aria-label="微博"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10.098 20.323c-3.977.391-7.414-1.406-7.672-4.02-.259-2.609 2.759-5.047 6.74-5.441 3.979-.394 7.413 1.404 7.671 4.018.259 2.6-2.759 5.049-6.739 5.443zM9.05 17.219c-.384.616-1.208.884-1.829.602-.612-.279-.793-.991-.406-1.593.379-.595 1.176-.861 1.793-.601.622.263.82.972.442 1.592zm1.27-1.627c-.141.237-.449.353-.689.253-.236-.09-.313-.361-.177-.586.138-.227.436-.346.672-.24.239.09.315.36.194.573zm.176-2.719c-1.893-.493-4.033.45-4.857 2.118-.836 1.704-.026 3.591 1.886 4.21 1.983.64 4.318-.341 5.132-2.179.8-1.793-.201-3.642-2.161-4.149zm7.563-1.224c-.346-.105-.57-.18-.405-.649.359-1.017.389-1.891.003-2.521-.722-1.177-2.69-1.112-4.986-.033 0 0-.712.309-.529-.254.354-1.147.288-2.112-.274-2.643-1.264-1.186-4.372.043-6.942 2.742C2.903 10.935 1.5 13.546 1.5 15.83c0 4.29 5.109 6.866 10.142 6.866 6.529 0 10.822-3.878 10.822-6.948 0-1.852-1.563-2.9-3.405-3.405-.654-.181-1.313-.284-1.97-.353z"/>
                  </svg>
                </a>
              )}
              {socialLinks.instagram && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/5 hover:bg-primary/20 hover:text-primary transition-all"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {socialLinks.x && (
                <a
                  href={socialLinks.x}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/5 hover:bg-primary/20 hover:text-primary transition-all"
                  aria-label="X"
                >
                  <XIcon />
                </a>
              )}
              {socialLinks.github && (
                <a
                  href={socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/5 hover:bg-primary/20 hover:text-primary transition-all"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
              )}
              {socialLinks.email && (
                <a
                  href={`mailto:${socialLinks.email}`}
                  className="p-2 rounded-full bg-white/5 hover:bg-primary/20 hover:text-primary transition-all"
                  aria-label="Email"
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
