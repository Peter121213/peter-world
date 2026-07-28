import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Camera, Music, Sparkles } from 'lucide-react'
import PhotoGrid from '@/components/PhotoGrid'
import type { Photo } from '@/types'

const Home = () => {
  const [featuredPhotos, setFeaturedPhotos] = useState<Photo[]>([])

  // 示例精选照片数据
  const samplePhotos: Photo[] = [
    {
      id: 1,
      title: '城市黄昏',
      description: '夕阳下的城市天际线',
      imageUrl: 'https://picsum.photos/seed/photo1/800/600',
      category: '风景',
      isFeatured: true,
      createdAt: '2024-01-15',
    },
    {
      id: 2,
      title: '人像写真',
      description: '自然光下的人像摄影',
      imageUrl: 'https://picsum.photos/seed/photo2/600/800',
      category: '人像',
      isFeatured: true,
      createdAt: '2024-01-20',
    },
    {
      id: 3,
      title: '街头瞬间',
      description: '城市街头的真实瞬间',
      imageUrl: 'https://picsum.photos/seed/photo3/600/600',
      category: '街拍',
      isFeatured: true,
      createdAt: '2024-02-01',
    },
    {
      id: 4,
      title: '自然风光',
      description: '山川湖海的壮丽景色',
      imageUrl: 'https://picsum.photos/seed/photo4/600/600',
      category: '风景',
      isFeatured: true,
      createdAt: '2024-02-10',
    },
    {
      id: 5,
      title: '创意光影',
      description: '光影与色彩的实验',
      imageUrl: 'https://picsum.photos/seed/photo5/800/600',
      category: '创意',
      isFeatured: true,
      createdAt: '2024-02-15',
    },
    {
      id: 6,
      title: '生活随拍',
      description: '日常生活中的小美好',
      imageUrl: 'https://picsum.photos/seed/photo6/600/600',
      category: '生活',
      isFeatured: true,
      createdAt: '2024-02-20',
    },
  ]

  useEffect(() => {
    setFeaturedPhotos(samplePhotos)
  }, [])

  return (
    <div className="pt-16 md:pt-20">
      {/* Hero 区域 */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* 背景图 */}
        <div className="absolute inset-0">
          <img
            src="https://picsum.photos/seed/hero/1920/1080"
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        </div>

        {/* 内容 */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="w-6 h-6 text-primary mr-2" />
              <span className="text-primary font-medium">欢迎来到我的小世界</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              用镜头记录美好，
              <br />
              <span className="gradient-text">用音乐传递情感</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              这里有一些我的生活碎片和喜欢的音乐
              <br />
              随便坐坐，听听歌，看看照片
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/portfolio" className="btn-primary flex items-center space-x-2">
                <span>随便看看</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/about" className="btn-secondary flex items-center space-x-2">
                <span>关于我</span>
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

      {/* 精选作品 */}
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
              <Camera className="w-5 h-5 text-primary mr-2" />
              <span className="text-primary text-sm font-medium tracking-wider uppercase">
                Featured Works
              </span>
            </div>
            <h2 className="section-title">精选作品</h2>
            <p className="section-subtitle">
              精选摄影作品，用镜头捕捉生活中的美好瞬间
            </p>
          </motion.div>

          <PhotoGrid photos={featuredPhotos} layout="bento" />

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
              <span>查看全部作品</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

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
              <Music className="w-5 h-5 text-primary mr-2" />
              <span className="text-primary text-sm font-medium tracking-wider uppercase">
                Music
              </span>
            </div>
            <h2 className="section-title">音乐陪伴</h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              每一张照片都有它的故事，每一首歌都有它的心情。
              <br />
              点击右下角的音乐按钮，开启你的听觉之旅。
            </p>
            <button
              onClick={() => {
                const event = new CustomEvent('toggleMusic')
                window.dispatchEvent(event)
              }}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Music className="w-5 h-5" />
              <span>播放音乐</span>
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
              <div className="aspect-square rounded-2xl overflow-hidden">
                <img
                  src="https://picsum.photos/seed/about/600/600"
                  alt="About Me"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="section-title mb-6">关于我</h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                你好，我是 Peter，一个热爱摄影和音乐的普通人。
                我喜欢用镜头记录生活中的美好瞬间，也喜欢用音乐表达内心的情感。
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                这个小世界是我分享作品和心情的地方，
                希望你能在这里找到一些共鸣和感动。
              </p>
              <Link to="/about" className="btn-primary inline-flex items-center space-x-2">
                <span>了解更多</span>
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
