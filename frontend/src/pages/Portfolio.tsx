import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Camera, Filter } from 'lucide-react'
import PhotoGrid from '@/components/PhotoGrid'
import { photosApi } from '@/lib/api'
import { cn } from '@/lib/utils'
import type { Photo } from '@/types'

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState('全部')
  const [photos, setPhotos] = useState<Photo[]>([])
  const [filteredPhotos, setFilteredPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)

  const categories = ['全部', '风景', '人像', '街拍', '创意', '生活']

  useEffect(() => {
    fetchPhotos()
  }, [])

  const fetchPhotos = async () => {
    try {
      setLoading(true)
      const res = await photosApi.getAll()
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
      setPhotos(formattedPhotos)
      setFilteredPhotos(formattedPhotos)
    } catch (error) {
      console.error('获取照片列表失败:', error)
      setPhotos([])
      setFilteredPhotos([])
    } finally {
      setLoading(false)
    }
  }
      createdAt: '2024-02-20',
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

        {/* 加载状态 */}
        {loading && (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          </div>
        )}

        {/* 照片网格 */}
        {!loading && (
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <PhotoGrid photos={filteredPhotos} layout="grid" />
          </motion.div>
        )}

        {/* 统计信息 */}
        {!loading && (
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
        )}
      </div>
    </div>
  )
}

export default Portfolio
