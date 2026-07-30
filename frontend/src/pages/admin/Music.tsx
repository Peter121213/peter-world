import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Music,
  Upload,
  Trash2,
  Play,
  Pause,
  Plus,
  X,
  Loader2,
} from 'lucide-react'
import { musicApi } from '@/lib/api'

interface Track {
  id: number
  title: string
  artist: string
  audioUrl: string
  coverUrl?: string
  duration: string
  createdAt: string
}

const AdminMusic = () => {
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [uploadForm, setUploadForm] = useState({
    title: '',
    artist: 'Peter',
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [isSavingOrder, setIsSavingOrder] = useState(false)
  const [playingId, setPlayingId] = useState<number | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // 页面加载时获取音乐列表
  useEffect(() => {
    fetchTracks()
  }, [])

  const fetchTracks = async () => {
    try {
      setLoading(true)
      const res = await musicApi.getAll()
      // 转换字段名
      const formattedTracks = res.tracks.map((t: any) => ({
        id: t.id,
        title: t.title,
        artist: t.artist || 'Peter',
        audioUrl: t.audio_url,
        coverUrl: t.cover_url,
        duration: t.duration || '',
        createdAt: t.created_at?.split('T')[0] || '',
      }))
      setTracks(formattedTracks)
    } catch (error) {
      console.error('获取音乐列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    setDragOverIndex(index)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = async (dropIndex: number) => {
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null)
      setDragOverIndex(null)
      return
    }

    const newTracks = [...tracks]
    const [draggedTrack] = newTracks.splice(draggedIndex, 1)
    newTracks.splice(dropIndex, 0, draggedTrack)

    setTracks(newTracks)
    setDraggedIndex(null)
    setDragOverIndex(null)

    // 保存排序
    try {
      setIsSavingOrder(true)
      await musicApi.reorder(newTracks)
    } catch (error) {
      console.error('保存排序失败:', error)
      alert('保存排序失败')
      // 重新获取数据
      fetchTracks()
    } finally {
      setIsSavingOrder(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这首音乐吗？')) return

    try {
      await musicApi.delete(id)
      setTracks((prev) => prev.filter((t) => t.id !== id))
      if (playingId === id) {
        setPlayingId(null)
        if (audioRef.current) {
          audioRef.current.pause()
          audioRef.current = null
        }
      }
    } catch (error) {
      console.error('删除音乐失败:', error)
      alert('删除失败，请重试')
    }
  }

  const handlePlay = (track: Track) => {
    if (playingId === track.id) {
      // 暂停
      if (audioRef.current) {
        audioRef.current.pause()
      }
      setPlayingId(null)
    } else {
      // 播放新的
      if (audioRef.current) {
        audioRef.current.pause()
      }
      const audio = new Audio(track.audioUrl)
      audio.play()
      audioRef.current = audio
      setPlayingId(track.id)

      audio.onended = () => {
        setPlayingId(null)
      }
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) {
      alert('请选择要上传的音乐文件')
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('title', uploadForm.title)
      formData.append('artist', uploadForm.artist)
      formData.append('audio', selectedFile)

      const res = await musicApi.upload(formData)
      
      if (res.track) {
        const newTrack: Track = {
          id: res.track.id,
          title: res.track.title,
          artist: res.track.artist || 'Peter',
          audioUrl: res.track.audio_url,
          coverUrl: res.track.cover_url,
          duration: res.track.duration || '',
          createdAt: res.track.created_at?.split('T')[0] || '',
        }
        setTracks((prev) => [newTrack, ...prev])
      }

      setIsUploadModalOpen(false)
      setUploadForm({
        title: '',
        artist: 'Peter',
      })
      setSelectedFile(null)
    } catch (error) {
      console.error('上传音乐失败:', error)
      alert('上传失败，请重试')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">音乐管理</h1>
          <p className="text-muted-foreground">管理你的背景音乐播放列表 · 拖拽歌曲可调整排序</p>
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
      </div>

      {/* 音乐列表 */}
      <div className="bg-card/50 rounded-xl border border-white/10 overflow-hidden">
        {loading ? (
          <div className="text-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">加载中...</p>
          </div>
        ) : (
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
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={handleDragLeave}
                  onDrop={() => handleDrop(index)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`border-b transition-colors cursor-move ${
                    draggedIndex === index ? 'opacity-50 bg-primary/5' : ''
                  } ${
                    dragOverIndex === index && draggedIndex !== index
                      ? 'border-primary border-t-2 border-b-2 bg-primary/5'
                      : 'border-white/5 hover:bg-white/5'
                  }`}
                >
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handlePlay(track)}
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
        )}

        {/* 空状态 */}
        {!loading && tracks.length === 0 && (
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
          <li>• 建议单首音乐大小不超过 20MB</li>
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
                    支持 MP3、WAV、OGG 格式，最大 20MB
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
                  disabled={isUploading || !uploadForm.title || !selectedFile}
                  className="flex-1 btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
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
