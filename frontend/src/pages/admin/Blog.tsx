import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  FileText,
  Plus,
  Trash2,
  Edit,
  X,
  Loader2,
  Upload,
} from 'lucide-react'
import { blogApi } from '@/lib/api'
import type { BlogPost } from '@/types'

const AdminBlog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    coverImage: '',
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // 页面加载时获取随笔列表
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

  const handleOpenCreate = () => {
    setEditingPost(null)
    setFormData({
      title: '',
      content: '',
      coverImage: '',
    })
    setSelectedFile(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (post: BlogPost) => {
    setEditingPost(post)
    setFormData({
      title: post.title,
      content: post.content,
      coverImage: post.coverImage || '',
    })
    setSelectedFile(null)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这篇随笔吗？')) return

    try {
      await blogApi.delete(id)
      setPosts((prev) => prev.filter((p) => p.id !== id))
    } catch (error) {
      console.error('删除随笔失败:', error)
      alert('删除失败，请重试')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title) {
      alert('请输入标题')
      return
    }

    setIsSaving(true)

    try {
      const formDataObj = new FormData()
      formDataObj.append('title', formData.title)
      formDataObj.append('content', formData.content)
      if (formData.coverImage && !selectedFile) {
        formDataObj.append('coverImage', formData.coverImage)
      }
      if (selectedFile) {
        formDataObj.append('coverImage', selectedFile)
      }

      if (editingPost) {
        // 编辑
        await blogApi.update(editingPost.id, formDataObj)
      } else {
        // 新增
        await blogApi.create(formDataObj)
      }

      setIsModalOpen(false)
      fetchPosts() // 重新获取列表
    } catch (error) {
      console.error('保存随笔失败:', error)
      alert('保存失败，请重试')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">随笔管理</h1>
          <p className="text-muted-foreground">管理你的生活随笔</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="btn-primary flex items-center justify-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>写新随笔</span>
        </button>
      </div>

      {/* 统计信息 */}
      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
        <span>共 {posts.length} 篇随笔</span>
      </div>

      {/* 加载状态 */}
      {loading ? (
        <div className="text-center py-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">加载中...</p>
        </div>
      ) : (
        <>
          {/* 随笔列表 */}
          <div className="space-y-4">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-card/50 rounded-xl border border-white/10 overflow-hidden hover:border-white/20 transition-colors"
              >
                <div className="flex flex-col sm:flex-row">
                  {/* 封面图 */}
                  {post.coverImage && (
                    <div className="sm:w-48 h-32 sm:h-auto flex-shrink-0">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  {/* 内容 */}
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-2 truncate">
                          {post.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {post.content || '暂无内容'}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>发布于 {post.createdAt}</span>
                          {post.updatedAt !== post.createdAt && (
                            <span>更新于 {post.updatedAt}</span>
                          )}
                        </div>
                      </div>
                      {/* 操作按钮 */}
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <button
                          onClick={() => handleOpenEdit(post)}
                          className="p-2 rounded-lg hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
                          title="编辑"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-2 rounded-lg hover:bg-red-500/10 transition-colors text-muted-foreground hover:text-red-500"
                          title="删除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* 空状态 */}
          {posts.length === 0 && (
            <div className="text-center py-20">
              <FileText className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">还没有写过随笔</p>
              <button
                onClick={handleOpenCreate}
                className="btn-primary inline-flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>写第一篇</span>
              </button>
            </div>
          )}
        </>
      )}

      {/* 新增/编辑弹窗 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-bold">
                {editingPost ? '编辑随笔' : '写新随笔'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* 标题 */}
              <div>
                <label className="block text-sm font-medium mb-2">标题</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  required
                  className="w-full px-4 py-2.5 bg-background/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors"
                  placeholder="给随笔起个标题"
                />
              </div>

              {/* 内容 */}
              <div>
                <label className="block text-sm font-medium mb-2">内容</label>
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                  rows={10}
                  className="w-full px-4 py-2.5 bg-background/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors resize-none"
                  placeholder="写点什么吧..."
                />
              </div>

              {/* 封面图 */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  封面图（可选）
                </label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors">
                  <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">
                    {selectedFile
                      ? selectedFile.name
                      : formData.coverImage
                      ? '已设置封面图（上传新文件将替换）'
                      : '点击选择或拖拽图片到这里'}
                  </span>
                  <span className="text-xs text-muted-foreground/70 mt-1">
                    支持 JPG、PNG、WebP 格式，最大 10MB
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      setSelectedFile(e.target.files?.[0] || null)
                    }
                  />
                </label>
                <p className="text-xs text-muted-foreground mt-2">
                  或者直接填图片 URL：
                </p>
                <input
                  type="text"
                  value={formData.coverImage}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      coverImage: e.target.value,
                    }))
                  }
                  placeholder="https://..."
                  className="w-full mt-2 px-4 py-2 bg-background/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors text-sm"
                />
              </div>

              {/* 提交按钮 */}
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-lg font-medium transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={isSaving || !formData.title}
                  className="flex-1 btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>保存中...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>{editingPost ? '保存修改' : '发布'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default AdminBlog
