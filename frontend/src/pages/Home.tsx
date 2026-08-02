import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Image, Music, Sparkles, FileText, Calendar } from 'lucide-react'
import PhotoGrid from '@/components/PhotoGrid'
import { photosApi, blogApi } from '@/lib/api'
import { useSettings } from '@/contexts/SettingsContext'
import type { Photo, BlogPost } from '@/types'

const Home = () => {
  const [featuredPhotos, setFeaturedPhotos] = useState<Photo[]>([])
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [postsLoading, setPostsLoading] = useState(true)
  const { settings } = useSettings()

  useEffect(() => {
    fetchFeaturedPhotos()
    fetchRecentPosts()
  }, [])

  const fetchFeaturedPhotos = async () => {
    try {
      setLoading(true)
      const res = await photosApi.getFeatured()
      // 转换字段名
      const formattedPhotos = res.photos.map((p: any) => ({
        id: p.id,
        title: p.title,
        description: p.description || '',
        imageUrl: p.image_url,
        category: p.category,
        isFeatured: p.is_featured,
        createdAt: p.created_at,
      }))
      setFeaturedPhotos(formattedPhotos)
    } catch (error) {
      console.error('获取精选照片失败:', error)
      setFeaturedPhotos([])
    } finally {
      setLoading(false)
    }
  }

  const fetchRecentPosts = async () => {
    try {
      setPostsLoading(true)
      const res = await blogApi.getRecent(2)
      // 转换字段名
      const formattedPosts = res.posts.map((p: any) => ({
        id: p.id,
        title: p.title,
        content: p.content || '',
        coverImage: p.cover_image || '',
        createdAt: p.created_at?.split('T')[0] || '',
        updatedAt: p.updated_at?.split('T')[0] || '',
      }))
      setRecentPosts(formattedPosts)
    } catch (error) {
      console.error('获取最近随笔失败:', error)
      setRecentPosts([])
    } finally {
      setPostsLoading(false)
    }
  }

  const heroBadge = settings?.heroBadge || '欢迎来到我的小世界'
  const heroTitle = (settings?.heroTitle || '用镜头记录美好，\n用音乐传递情感').replace(/\\n/g, '\n')
  const heroSubtitle = (settings?.heroSubtitle || '这里有一些我的生活碎片和喜欢的音乐\n随便坐坐，听听歌，看看照片').replace(/\\n/g, '\n')
  const heroButton1 = settings?.heroButton1 || '随便看看'
  const heroButton2 = settings?.heroButton2 || '关于我'
  const heroImage = settings?.heroImage || ''

  const featuredPhotosBadge = settings?.featuredPhotosBadge || 'Featured Photos'
  const featuredPhotosTitle = settings?.featuredPhotosTitle || '精选照片'
  const featuredPhotosDesc = settings?.featuredPhotosDesc || '一些我觉得还不错的照片，记录生活中的小美好'
  const featuredPhotosViewAll = settings?.featuredPhotosViewAll || '查看全部照片'

  const recentPostsBadge = settings?.recentPostsBadge || 'Recent Posts'
  const recentPostsTitle = settings?.recentPostsTitle || '最近随笔'
  const recentPostsDesc = settings?.recentPostsDesc || '随便写写，记录一下生活'
  const recentPostsViewAll = settings?.recentPostsViewAll || '查看全部随笔'

  const musicBadge = settings?.musicBadge || 'Music'
  const musicTitle = settings?.musicSectionTitle || '音乐陪伴'
  const musicDesc = (settings?.musicSectionDescription || '每一张照片都有它的故事，每一首歌都有它的心情。').replace(/\\n/g, '\n')
  const musicButton = settings?.musicButton || '播放音乐'

  const aboutTitle = settings?.aboutTitle || '关于我'
  const aboutContent = (settings?.aboutContent || '你好，我是 Peter，一个热爱摄影和音乐的普通人。').replace(/\\n/g, '\n')
  const aboutImage = settings?.aboutImage || ''
  const aboutPreviewButton = settings?.aboutPreviewButton || '了解更多'

  return (
    <div className="pt-16 md:pt-20">
      {/* Hero 区域 */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-background">
        {/* 背景图 - 加载完成后淡入显示 */}
        {heroImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <img
              src={heroImage}
              alt="Hero Background"
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}
        {/* 渐变遮罩 - 保证文字清晰 */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />

        {/* 内容 */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="w-6 h-6 text-accent mr-2 drop-shadow-lg" />
              <span className="text-accent font-medium drop-shadow-lg">{heroBadge}</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight whitespace-pre-line text-accent drop-shadow-2xl">
              {heroTitle}
            </h1>
            <p className="text-lg md:text-xl text-foreground mb-10 max-w-2xl mx-auto leading-relaxed whitespace-pre-line drop-shadow-lg">
              {heroSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/portfolio" className="btn-primary flex items-center space-x-2">
                <span>{heroButton1}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/about" className="btn-secondary flex items-center space-x-2">
                <span>{heroButton2}</span>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* 向下滚动提示 */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/50 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* 精选照片 */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center mb-4">
              <Image className="w-5 h-5 text-accent mr-2" />
              <span className="text-accent text-sm font-medium tracking-wider uppercase">
                {featuredPhotosBadge}
              </span>
            </div>
            <h2 className="section-title">{featuredPhotosTitle}</h2>
            <p className="section-subtitle">
              {featuredPhotosDesc}
            </p>
          </motion.div>

          {!loading && featuredPhotos.length > 0 && (
            <PhotoGrid photos={featuredPhotos} layout="bento" />
          )}

          {loading && (
            <div className="text-center py-20">
              <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
            </div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              to="/portfolio"
              className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors font-medium"
            >
              <span>{featuredPhotosViewAll}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 最近随笔 */}
      {recentPosts.length > 0 && (
        <section className="py-20 px-4 bg-card/30">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <div className="flex items-center justify-center mb-4">
                <FileText className="w-5 h-5 text-accent mr-2" />
                <span className="text-accent text-sm font-medium tracking-wider uppercase">
                  {recentPostsBadge}
                </span>
              </div>
              <h2 className="section-title">{recentPostsTitle}</h2>
              <p className="section-subtitle">
                {recentPostsDesc}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {recentPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-card/50 rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-colors"
                >
                  {post.coverImage && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>{post.createdAt}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3">{post.title}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-3">
                      {post.content}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-10"
            >
              <Link
                to="/blog"
                className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors font-medium"
              >
                <span>{recentPostsViewAll}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* 音乐区域 */}
      <section className="py-20 px-4 bg-card/30">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center mb-4">
              <Music className="w-5 h-5 text-accent mr-2" />
              <span className="text-accent text-sm font-medium tracking-wider uppercase">
                {musicBadge}
              </span>
            </div>
            <h2 className="section-title">{musicTitle}</h2>
            <p className="section-subtitle max-w-2xl mx-auto whitespace-pre-line">
              {musicDesc}
            </p>
            <button
              onClick={() => {
                const event = new CustomEvent('toggleMusic')
                window.dispatchEvent(event)
              }}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Music className="w-5 h-5" />
              <span>{musicButton}</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* 关于我 预览 */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl overflow-hidden bg-card/50">
                {aboutImage && (
                  <motion.img
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    src={aboutImage}
                    alt="About Me"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="section-title mb-6">{aboutTitle}</h2>
              <div className="text-muted-foreground text-lg leading-relaxed mb-6 space-y-4">
                {aboutContent.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
              <Link to="/about" className="btn-primary inline-flex items-center space-x-2">
                <span>{aboutPreviewButton}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
