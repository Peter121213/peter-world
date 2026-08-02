import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Image, Filter } from 'lucide-react'
import PhotoGrid from '@/components/PhotoGrid'
import { photosApi } from '@/lib/api'
import { cn } from '@/lib/utils'
import { useSettings } from '@/contexts/SettingsContext'
import type { Photo } from '@/types'

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState('全部')
  const [photos, setPhotos] = useState<Photo[]>([])
  const [filteredPhotos, setFilteredPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const { settings } = useSettings()

  useEffect(() => {
    fetchPhotos()
  }, [])

  const categories = [
    settings?.albumCategoryAll || '全部',
    settings?.albumCategory1 || '风景',
    settings?.albumCategory2 || '人像',
    settings?.albumCategory3 || '美食',
    settings?.albumCategory4 || '小动物',
    settings?.albumCategory5 || '其他',
  ]

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
            <Image className="w-5 h-5 text-accent mr-2" />
            <span className="text-accent text-sm font-medium tracking-wider uppercase">
              {settings?.albumBadge || 'Album'}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{settings?.albumTitle || '相册'}</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto whitespace-pre-line">
            {settings?.albumDesc || '随手拍的一些照片，记录生活中的点点滴滴\n随便看看吧～'}
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
        {!loading && filteredPhotos.length > 0 && (
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <PhotoGrid photos={filteredPhotos} layout="grid" />
          </motion.div>
        )}

        {/* 空状态 */}
        {!loading && filteredPhotos.length === 0 && (
          <div className="text-center py-20">
            <Image className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">{settings?.albumEmpty || '还没有照片～'}</p>
          </div>
        )}


      </div>
    </div>
  )
}

export default Portfolio
