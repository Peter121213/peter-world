import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Music,
  Upload,
  Trash2,
  Play,
  Pause,
  Plus,
  X,
} from 'lucide-react'

interface Track {
  id: number
  title: string
  artist: string
  audioUrl: string
  duration: string
  createdAt: string
}

const AdminMusic = () => {
  const [tracks, setTracks] = useState<Track[]>([
    {
      id: 1,
      title: '夏日微风',
      artist: 'Peter',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      duration: '3:45',
      createdAt: '2024-01-15',
    },
    {
      id: 2,
      title: '星空漫步',
      artist: 'Peter',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      duration: '4:12',
      createdAt: '2024-01-20',
    },
    {
      id: 3,
      title: '午后阳光',
      artist: 'Peter',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
      duration: '3:58',
      createdAt: '2024-02-01',
    },
  ])

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [uploadForm, setUploadForm] = useState({
    title: '',
    artist: 'Peter',
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [playingId, setPlayingId] = useState<number | null>(null)

  const handleDelete = (id: number) => {
    if (confirm('确定要删除这首音乐吗？')) {
      setTracks((prev) => prev.filter((t) => t.id !== id))
      if (playingId === id) setPlayingId(null)
    }
  }

  const handlePlay = (id: number) => {
    if (playingId === id) {
      setPlayingId(null)
    } else {
      setPlayingId(id)
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)

    // 模拟上传
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const newTrack: Track = {
      id: Date.now(),
      title: uploadForm.title,
      artist: uploadForm.artist,
      audioUrl: selectedFile
        ? URL.createObjectURL(selectedFile)
        : 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
      duration: '4:00',
      createdAt: new Date().toISOString().split('T')[0],
    }

    setTracks((prev) => [...prev, newTrack])
    setIsUploadModalOpen(false)
    setUploadForm({
      title: '',
      artist: 'Peter',
    })
    setSelectedFile(null)
    setIsUploading(false)
  }

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">音乐管理</h1>
          <p className="text-muted-foreground">管理你的背景音乐播放列表</p>
        </div>
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="btn-primary flex items-center justify-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>添加音乐</span>
        </button>
      </div>

      {/* 统计信息 */}
      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
        <span>共 {tracks.length} 首音乐</span>
        <span>•</span>
        <span>总时长约 {tracks.length * 4} 分钟</span>
      </div>

      {/* 音乐列表 */}
      <div className="bg-card/50 rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                #
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                标题
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground hidden sm:table-cell">
                艺术家
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground hidden md:table-cell">
                时长
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground hidden lg:table-cell">
                添加时间
              </th>
              <th className="text-right py-4 px-6 text-sm font-medium text-muted-foreground">
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            {tracks.map((track, index) => (
              <motion.tr
                key={track.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="py-4 px-6">
                  <button
                    onClick={() => handlePlay(track.id)}
                    className="w-8 h-8 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors flex items-center justify-center"
                  >
                    {playingId === track.id ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4 ml-0.5" />
                    )}
                  </button>
                </td>
                <td className="py-4 px-6">
                  <div className="font-medium">{track.title}</div>
                  <div className="text-sm text-muted-foreground sm:hidden">
                    {track.artist}
                  </div>
                </td>
                <td className="py-4 px-6 text-muted-foreground hidden sm:table-cell">
                  {track.artist}
                </td>
                <td className="py-4 px-6 text-muted-foreground hidden md:table-cell">
                  {track.duration}
                </td>
                <td className="py-4 px-6 text-muted-foreground hidden lg:table-cell">
                  {track.createdAt}
                </td>
                <td className="py-4 px-6 text-right">
                  <button
                    onClick={() => handleDelete(track.id)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                    title="删除"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {/* 空状态 */}
        {tracks.length === 0 && (
          <div className="text-center py-20">
            <Music className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">还没有添加音乐</p>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="mt-4 text-primary hover:underline"
            >
              添加第一首音乐
            </button>
          </div>
        )}
      </div>

      {/* 提示信息 */}
      <div className="bg-primary/5 rounded-xl border border-primary/20 p-6">
        <h3 className="font-semibold mb-2">💡 使用提示</h3>
        <ul className="text-sm text-muted-foreground space-y-2">
          <li>• 音乐将在网站右下角的播放器中播放</li>
          <li>• 支持 MP3、WAV、OGG 等常见音频格式</li>
          <li>• 建议单首音乐大小不超过 10MB</li>
          <li>• 音乐播放顺序按添加时间排列</li>
        </ul>
      </div>

      {/* 上传弹窗 */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-2xl w-full max-w-lg"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-bold">添加音乐</h2>
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
                  选择音乐文件
                </label>
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors">
                  <Upload className="w-10 h-10 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">
                    {selectedFile ? selectedFile.name : '点击选择或拖拽音频文件到这里'}
                  </span>
                  <span className="text-xs text-muted-foreground/70 mt-1">
                    支持 MP3、WAV、OGG 格式
                  </span>
                  <input
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={(e) =>
                      setSelectedFile(e.target.files?.[0] || null)
                    }
                  />
                </label>
              </div>

              {/* 标题 */}
              <div>
                <label className="block text-sm font-medium mb-2">歌曲标题</label>
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
                  placeholder="输入歌曲名称"
                />
              </div>

              {/* 艺术家 */}
              <div>
                <label className="block text-sm font-medium mb-2">艺术家</label>
                <input
                  type="text"
                  value={uploadForm.artist}
                  onChange={(e) =>
                    setUploadForm((prev) => ({
                      ...prev,
                      artist: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2.5 bg-background/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors"
                  placeholder="艺术家名称"
                />
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
                      <span>添加</span>
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

export default AdminMusic
