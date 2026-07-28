import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Image,
  Upload,
  Trash2,
  Edit,
  Search,
  Filter,
  Plus,
  X,
  Star,
} from 'lucide-react'

interface Photo {
  id: number
  title: string
  description: string
  imageUrl: string
  category: string
  isFeatured: boolean
  createdAt: string
}

const AdminPhotos = () => {
  const [photos, setPhotos] = useState<Photo[]>([
    {
      id: 1,
      title: '城市黄昏',
      description: '夕阳下的城市天际线',
      imageUrl: 'https://picsum.photos/seed/admin1/400/300',
      category: '风景',
      isFeatured: true,
      createdAt: '2024-01-15',
    },
    {
      id: 2,
      title: '人像写真',
      description: '自然光下的人像摄影',
      imageUrl: 'https://picsum.photos/seed/admin2/400/300',
      category: '人像',
      isFeatured: true,
      createdAt: '2024-01-20',
    },
    {
      id: 3,
      title: '街头瞬间',
      description: '城市街头的真实瞬间',
      imageUrl: 'https://picsum.photos/seed/admin3/400/300',
      category: '街拍',
      isFeatured: false,
      createdAt: '2024-02-01',
    },
    {
      id: 4,
      title: '自然风光',
      description: '山川湖海的壮丽景色',
      imageUrl: 'https://picsum.photos/seed/admin4/400/300',
      category: '风景',
      isFeatured: true,
      createdAt: '2024-02-10',
    },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('全部')
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    category: '风景',
    isFeatured: false,
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const categories = ['全部', '风景', '人像', '街拍', '创意', '生活']

  const filteredPhotos = photos.filter((photo) => {
    const matchesSearch = photo.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesCategory =
      selectedCategory === '全部' || photo.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleDelete = (id: number) => {
    if (confirm('确定要删除这张照片吗？')) {
      setPhotos((prev) => prev.filter((p) => p.id !== id))
    }
  }

  const handleToggleFeatured = (id: number) => {
    setPhotos((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, isFeatured: !p.isFeatured } : p
      )
    )
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)

    // 模拟上传
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const newPhoto: Photo = {
      id: Date.now(),
      title: uploadForm.title,
      description: uploadForm.description,
      imageUrl: selectedFile
        ? URL.createObjectURL(selectedFile)
        : `https://picsum.photos/seed/${Date.now()}/400/300`,
      category: uploadForm.category,
      isFeatured: uploadForm.isFeatured,
      createdAt: new Date().toISOString().split('T')[0],
    }

    setPhotos((prev) => [newPhoto, ...prev])
    setIsUploadModalOpen(false)
    setUploadForm({
      title: '',
      description: '',
      category: '风景',
      isFeatured: false,
    })
    setSelectedFile(null)
    setIsUploading(false)
  }

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">照片管理</h1>
          <p className="text-muted-foreground">管理你的所有摄影作品</p>
        </div>
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="btn-primary flex items-center justify-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>上传照片</span>
        </button>
      </div>

      {/* 搜索和筛选 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="搜索照片..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-card/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-muted-foreground" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2.5 bg-card/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 统计信息 */}
      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
        <span>共 {filteredPhotos.length} 张照片</span>
        <span>•</span>
        <span>{photos.filter((p) => p.isFeatured).length} 张精选</span>
      </div>

      {/* 照片网格 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPhotos.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-card/50 rounded-xl overflow-hidden border border-white/10 group"
          >
            {/* 图片 */}
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={photo.imageUrl}
                alt={photo.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* 悬浮操作 */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3">
                <button
                  onClick={() => handleToggleFeatured(photo.id)}
                  className={`p-2 rounded-full transition-colors ${
                    photo.isFeatured
                      ? 'bg-yellow-500 text-white'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                  title={photo.isFeatured ? '取消精选' : '设为精选'}
                >
                  <Star
                    className={`w-5 h-5 ${photo.isFeatured ? 'fill-current' : ''}`}
                  />
                </button>
                <button
                  className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
                  title="编辑"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(photo.id)}
                  className="p-2 rounded-full bg-red-500/80 text-white hover:bg-red-500 transition-colors"
                  title="删除"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              {/* 精选标签 */}
              {photo.isFeatured && (
                <div className="absolute top-3 left-3 px-2 py-1 bg-yellow-500 text-white text-xs rounded-full flex items-center space-x-1">
                  <Star className="w-3 h-3 fill-current" />
                  <span>精选</span>
                </div>
              )}
            </div>
            {/* 信息 */}
            <div className="p-4">
              <h3 className="font-semibold mb-1 truncate">{photo.title}</h3>
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                {photo.description}
              </p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="px-2 py-1 bg-white/5 rounded-full">
                  {photo.category}
                </span>
                <span>{photo.createdAt}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 空状态 */}
      {filteredPhotos.length === 0 && (
        <div className="text-center py-20">
          <Image className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">没有找到匹配的照片</p>
        </div>
      )}

      {/* 上传弹窗 */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-bold">上传照片</h2>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="p-6 space-y-6">
              {/* 文件上传区域 */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  选择照片
                </label>
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors">
                  <Upload className="w-10 h-10 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">
                    {selectedFile ? selectedFile.name : '点击选择或拖拽图片到这里'}
                  </span>
                  <span className="text-xs text-muted-foreground/70 mt-1">
                    支持 JPG、PNG、WebP 格式
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
              </div>

              {/* 标题 */}
              <div>
                <label className="block text-sm font-medium mb-2">标题</label>
                <input
                  type="text"
                  value={uploadForm.title}
                  onChange={(e) =>
                    setUploadForm((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  required
                  className="w-full px-4 py-2.5 bg-background/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors"
                  placeholder="给照片起个名字"
                />
              </div>

              {/* 描述 */}
              <div>
                <label className="block text-sm font-medium mb-2">描述</label>
                <textarea
                  value={uploadForm.description}
                  onChange={(e) =>
                    setUploadForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                  className="w-full px-4 py-2.5 bg-background/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors resize-none"
                  placeholder="描述一下这张照片..."
                />
              </div>

              {/* 分类 */}
              <div>
                <label className="block text-sm font-medium mb-2">分类</label>
                <select
                  value={uploadForm.category}
                  onChange={(e) =>
                    setUploadForm((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2.5 bg-background/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors"
                >
                  {categories.slice(1).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* 设为精选 */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="featured"
                  checked={uploadForm.isFeatured}
                  onChange={(e) =>
                    setUploadForm((prev) => ({
                      ...prev,
                      isFeatured: e.target.checked,
                    }))
                  }
                  className="w-5 h-5 rounded border-white/20 bg-background/50 text-primary focus:ring-primary"
                />
                <label htmlFor="featured" className="text-sm">
                  设为精选照片（显示在首页）
                </label>
              </div>

              {/* 提交按钮 */}
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-lg font-medium transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={isUploading || !uploadForm.title}
                  className="flex-1 btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>上传中...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>上传</span>
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

export default AdminPhotos
