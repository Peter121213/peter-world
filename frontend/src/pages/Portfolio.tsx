import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Camera, Filter } from 'lucide-react'
import PhotoGrid from '@/components/PhotoGrid'
import { cn } from '@/lib/utils'
import type { Photo } from '@/types'

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState('全部')
  const [photos, setPhotos] = useState<Photo[]>([])
  const [filteredPhotos, setFilteredPhotos] = useState<Photo[]>([])

  const categories = ['全部', '风景', '人像', '街拍', '创意', '生活']

  // 示例照片数据
  const samplePhotos: Photo[] = [
    {
      id: 1,
      title: '城市黄昏',
      description: '夕阳下的城市天际线，金色的阳光洒在高楼大厦上',
      imageUrl: 'https://picsum.photos/seed/port1/800/600',
      category: '风景',
      isFeatured: true,
      createdAt: '2024-01-15',
    },
    {
      id: 2,
      title: '人像写真',
      description: '自然光下的人像摄影，捕捉最真实的表情',
      imageUrl: 'https://picsum.photos/seed/port2/600/800',
      category: '人像',
      isFeatured: true,
      createdAt: '2024-01-20',
    },
    {
      id: 3,
      title: '街头瞬间',
      description: '城市街头的真实瞬间，每个人都有自己的故事',
      imageUrl: 'https://picsum.photos/seed/port3/600/600',
      category: '街拍',
      isFeatured: true,
      createdAt: '2024-02-01',
    },
    {
      id: 4,
      title: '山川湖海',
      description: '大自然的壮丽景色，让人心旷神怡',
      imageUrl: 'https://picsum.photos/seed/port4/800/600',
      category: '风景',
      isFeatured: false,
      createdAt: '2024-02-10',
    },
    {
      id: 5,
      title: '创意光影',
      description: '光影与色彩的实验，探索摄影的无限可能',
      imageUrl: 'https://picsum.photos/seed/port5/600/600',
      category: '创意',
      isFeatured: true,
      createdAt: '2024-02-15',
    },
    {
      id: 6,
      title: '生活随拍',
      description: '日常生活中的小美好，值得被记录',
      imageUrl: 'https://picsum.photos/seed/port6/600/800',
      category: '生活',
      isFeatured: false,
      createdAt: '2024-02-20',
    },
    {
      id: 7,
      title: '晨雾弥漫',
      description: '清晨的雾气，给世界蒙上一层神秘的面纱',
      imageUrl: 'https://picsum.photos/seed/port7/800/600',
      category: '风景',
      isFeatured: false,
      createdAt: '2024-03-01',
    },
    {
      id: 8,
      title: '微笑瞬间',
      description: '最真挚的笑容，是最好的礼物',
      imageUrl: 'https://picsum.photos/seed/port8/600/600',
      category: '人像',
      isFeatured: false,
      createdAt: '2024-03-05',
    },
    {
      id: 9,
      title: '城市夜色',
      description: '霓虹灯下的城市，有着不一样的魅力',
      imageUrl: 'https://picsum.photos/seed/port9/800/600',
      category: '街拍',
      isFeatured: false,
      createdAt: '2024-03-10',
    },
  ]

  useEffect(() => {
    setPhotos(samplePhotos)
    setFilteredPhotos(samplePhotos)
  }, [])

  useEffect(() => {
    if (activeCategory === '全部') {
      setFilteredPhotos(photos)
    } else {
      setFilteredPhotos(photos.filter((photo) => photo.category === activeCategory))
    }
  }, [activeCategory, photos])

  return (
    <div className="pt-24 md:pt-28 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-4">
            <Camera className="w-5 h-5 text-primary mr-2" />
            <span className="text-primary text-sm font-medium tracking-wider uppercase">
              Portfolio
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">作品集</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            用镜头记录生活，用光影讲述故事。
            <br />
            这里是我的摄影作品集，希望你能喜欢。
          </p>
        </motion.div>

        {/* 分类筛选 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-12"
        >
          <Filter className="w-5 h-5 text-muted-foreground mr-2" />
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                'px-5 py-2 rounded-full text-sm font-medium transition-all duration-300',
                activeCategory === category
                  ? 'bg-primary text-white shadow-lg shadow-primary/30'
                  : 'bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground'
              )}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* 照片网格 */}
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <PhotoGrid photos={filteredPhotos} layout="grid" />
        </motion.div>

        {/* 统计信息 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          <div>
            <div className="text-4xl font-bold gradient-text mb-2">{photos.length}+</div>
            <div className="text-muted-foreground">摄影作品</div>
          </div>
          <div>
            <div className="text-4xl font-bold gradient-text mb-2">{categories.length - 1}</div>
            <div className="text-muted-foreground">作品分类</div>
          </div>
          <div>
            <div className="text-4xl font-bold gradient-text mb-2">365+</div>
            <div className="text-muted-foreground">天坚持拍摄</div>
          </div>
          <div>
            <div className="text-4xl font-bold gradient-text mb-2">∞</div>
            <div className="text-muted-foreground">热爱与热情</div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Portfolio
