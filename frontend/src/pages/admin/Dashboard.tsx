import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Image,
  Music,
  MessageSquare,
  TrendingUp,
  ArrowUpRight,
  Clock,
  Loader2,
} from 'lucide-react'
import { photosApi, musicApi, contactApi } from '@/lib/api'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    photos: 0,
    music: 0,
    messages: 0,
    views: 0,
  })
  const [loading, setLoading] = useState(true)

  const [recentActivity, setRecentActivity] = useState<
    Array<{
      id: number
      type: string
      title: string
      time: string
    }>
  >([])

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      
      // 并行获取各项数据
      const [photosRes, musicRes, messagesRes] = await Promise.all([
        photosApi.getAll().catch(() => ({ photos: [] })),
        musicApi.getAll().catch(() => ({ tracks: [] })),
        contactApi.getAll().catch(() => ({ messages: [] })),
      ])

      setStats({
        photos: photosRes.photos?.length || 0,
        music: musicRes.tracks?.length || 0,
        messages: messagesRes.messages?.length || 0,
        views: 0, // 访问量功能暂未实现
      })

      // 生成最近活动（基于真实数据）
      const activities: Array<{ id: number; type: string; title: string; time: string }> = []
      
      // 添加最近的照片
      if (photosRes.photos?.length > 0) {
        photosRes.photos.slice(0, 3).forEach((photo: any, index: number) => {
          activities.push({
            id: index,
            type: 'photo',
            title: `上传了新照片「${photo.title}」`,
            time: formatTime(photo.created_at),
          })
        })
      }

      // 添加最近的音乐
      if (musicRes.tracks?.length > 0) {
        musicRes.tracks.slice(0, 2).forEach((track: any, index: number) => {
          activities.push({
            id: 100 + index,
            type: 'music',
            title: `添加了新音乐「${track.title}」`,
            time: formatTime(track.created_at),
          })
        })
      }

      // 添加最近的留言
      if (messagesRes.messages?.length > 0) {
        messagesRes.messages.slice(0, 2).forEach((msg: any, index: number) => {
          activities.push({
            id: 200 + index,
            type: 'message',
            title: `收到来自「${msg.name}」的留言`,
            time: formatTime(msg.created_at),
          })
        })
      }

      // 按时间排序（简单处理）
      setRecentActivity(activities.slice(0, 5))

    } catch (error) {
      console.error('获取统计数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (dateStr: string) => {
    if (!dateStr) return '未知'
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)
    
    if (hours < 1) return '刚刚'
    if (hours < 24) return `${hours} 小时前`
    if (days < 7) return `${days} 天前`
    return date.toLocaleDateString()
  }

  const statCards = [
    {
      label: '照片总数',
      value: stats.photos,
      icon: Image,
      color: 'from-blue-500 to-blue-600',
    },
    {
      label: '音乐数量',
      value: stats.music,
      icon: Music,
      color: 'from-purple-500 to-purple-600',
    },
    {
      label: '留言数量',
      value: stats.messages,
      icon: MessageSquare,
      color: 'from-green-500 to-green-600',
    },
    {
      label: '访问量',
      value: stats.views,
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600',
    },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'photo':
        return Image
      case 'music':
        return Music
      case 'message':
        return MessageSquare
      default:
        return Clock
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'photo':
        return 'bg-blue-500/10 text-blue-500'
      case 'music':
        return 'bg-purple-500/10 text-purple-500'
      case 'message':
        return 'bg-green-500/10 text-green-500'
      default:
        return 'bg-gray-500/10 text-gray-500'
    }
  }

  return (
    <div className="space-y-8">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold mb-2">仪表盘</h1>
        <p className="text-muted-foreground">欢迎回来，这是你的网站概览</p>
      </div>

      {/* 统计卡片 */}
      {loading ? (
        <div className="text-center py-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">加载中...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, index) => {
            const Icon = card.icon
            return (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card/50 rounded-xl p-6 border border-white/10 hover:border-white/20 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-br ${card.color} shadow-lg`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold mb-1">{card.value}</div>
                <div className="text-muted-foreground text-sm">{card.label}</div>
              </motion.div>
            )
          })}
        </div>
      )}

      {!loading && (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* 最近活动 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-2 bg-card/50 rounded-xl border border-white/10 p-6"
          >
            <h2 className="text-lg font-semibold mb-6">最近活动</h2>
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity, index) => {
                  const Icon = getActivityIcon(activity.type)
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                      className="flex items-center space-x-4 p-3 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <div
                        className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-sm text-muted-foreground">{activity.time}</p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                暂无活动记录
              </div>
            )}
          </motion.div>

          {/* 快捷操作 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-card/50 rounded-xl border border-white/10 p-6"
          >
            <h2 className="text-lg font-semibold mb-6">快捷操作</h2>
            <div className="space-y-3">
              <a
                href="/admin/photos"
                className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <Image className="w-5 h-5 text-primary" />
                  <span className="font-medium">上传照片</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
              <a
                href="/admin/music"
                className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <Music className="w-5 h-5 text-primary" />
                  <span className="font-medium">添加音乐</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
              <a
                href="/admin/settings"
                className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  <span className="font-medium">网站设置</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            </div>
          </motion.div>
        </div>
      )}

      {/* 系统提示 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20 p-6"
      >
        <h3 className="font-semibold mb-2">💡 使用提示</h3>
        <p className="text-muted-foreground text-sm">
          欢迎使用 Peter 的小世界管理后台！你可以在这里管理照片、音乐和网站设置。
          所有修改都会实时同步到前端网站。
        </p>
      </motion.div>
    </div>
  )
}

export default AdminDashboard
