import { Github, Twitter, Instagram, Mail, Heart } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-card/50 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 品牌信息 */}
          <div>
            <h3 className="text-xl font-bold gradient-text mb-4">
              Peter 的小世界
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              用镜头记录美好，用音乐传递情感。
              <br />
              欢迎来到我的小世界。
            </p>
          </div>

          {/* 快速链接 */}
          <div>
            <h4 className="text-lg font-semibold mb-4">快速链接</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/" className="hover:text-primary transition-colors">
                  首页
                </a>
              </li>
              <li>
                <a
                  href="/portfolio"
                  className="hover:text-primary transition-colors"
                >
                  作品集
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-primary transition-colors">
                  关于我
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="hover:text-primary transition-colors"
                >
                  联系我
                </a>
              </li>
            </ul>
          </div>

          {/* 社交媒体 */}
          <div>
            <h4 className="text-lg font-semibold mb-4">关注我</h4>
            <div className="flex space-x-4">
              <a
                href="#"
                className="p-2 rounded-full bg-white/5 hover:bg-primary/20 hover:text-primary transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full bg-white/5 hover:bg-primary/20 hover:text-primary transition-all"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full bg-white/5 hover:bg-primary/20 hover:text-primary transition-all"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="mailto:hello@peter.world"
                className="p-2 rounded-full bg-white/5 hover:bg-primary/20 hover:text-primary transition-all"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* 版权信息 */}
        <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center space-x-1">
            <span>© {currentYear} Peter 的小世界. Made with</span>
            <Heart className="w-4 h-4 text-primary fill-primary" />
            <span>by Peter</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
