import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileText, Calendar, Loader2 } from 'lucide-react'
import { blogApi } from '@/lib/api'
import { useSettings } from '@/contexts/SettingsContext'
import type { BlogPost } from '@/types'

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const { settings } = useSettings()

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const res = await blogApi.getAll()
      // 转换字段名
      const formattedPosts = res.posts.map((p: any) => ({
        id: p.id,
        title: p.title,
        content: p.content || '',
        coverImage: p.cover_image || '',
        createdAt: p.created_at?.split('T')[0] || '',
        updatedAt: p.updated_at?.split('T')[0] || '',
      }))
      setPosts(formattedPosts)
    } catch (error) {
      console.error('获取随笔列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-24 md:pt-28 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-4">
            <FileText className="w-5 h-5 text-primary mr-2" />
            <span className="text-primary text-sm font-medium tracking-wider uppercase">
              {settings?.blogBadge || 'Blog'}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{settings?.blogTitle || '生活随笔'}</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {settings?.blogDesc || '记录生活中的点点滴滴，一些想法，一些感受'}
          </p>
        </motion.div>

        {/* 加载状态 */}
        {loading && (
          <div className="text-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">加载中...</p>
          </div>
        )}

        {/* 随笔列表 */}
        {!loading && (
          <div className="space-y-8">
            {posts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-card/30 rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-colors"
              >
                {/* 封面图 */}
                {post.coverImage && (
                  <div className="w-full h-64 overflow-hidden">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                {/* 内容 */}
                <div className="p-8">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{post.createdAt}</span>
                    </div>
                    {post.updatedAt !== post.createdAt && (
                      <span className="text-xs">更新于 {post.updatedAt}</span>
                    )}
                  </div>

                  <h2 className="text-2xl font-bold mb-4">{post.title}</h2>

                  <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {post.content}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {/* 空状态 */}
        {!loading && posts.length === 0 && (
          <div className="text-center py-20">
            <FileText className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">{settings?.blogEmpty || '还没有写过随笔～'}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Blog
