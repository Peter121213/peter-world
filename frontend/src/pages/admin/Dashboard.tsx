import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Image,
  Music,
  MessageSquare,
  TrendingUp,
  ArrowUpRight,
  Clock,
} from 'lucide-react'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    photos: 0,
    music: 0,
    messages: 0,
    views: 0,
  })

  const [recentActivity, setRecentActivity] = useState<
    Array<{
      id: number
      type: string
      title: string
      time: string
    }>
  >([])

  useEffect(() => {
    // 模拟数据
    setStats({
      photos: 42,
      music: 8,
      messages: 15,
      views: 1234,
    })

    setRecentActivity([
      { id: 1, type: 'photo', title: '上传了新照片「城市黄昏」', time: '2 小时前' },
      { id: 2, type: 'message', title: '收到新的留言', time: '5 小时前' },
      { id: 3, type: 'music', title: '添加了新音乐「夏日微风」', time: '昨天' },
      { id: 4, type: 'photo', title: '更新了照片描述', time: '2 天前' },
      { id: 5, type: 'message', title: '回复了留言', time: '3 天前' },
    ])
  }, [])

  const statCards = [
    {
      label: '照片总数',
      value: stats.photos,
      icon: Image,
      color: 'from-blue-500 to-blue-600',
      change: '+3',
      changeLabel: '本周新增',
    },
    {
      label: '音乐数量',
      value: stats.music,
      icon: Music,
      color: 'from-purple-500 to-purple-600',
      change: '+1',
      changeLabel: '本周新增',
    },
    {
      label: '留言数量',
      value: stats.messages,
      icon: MessageSquare,
      color: 'from-green-500 to-green-600',
      change: '+5',
      changeLabel: '本周新增',
    },
    {
      label: '访问量',
      value: stats.views,
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600',
      change: '+12%',
      changeLabel: '较上周',
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
                <div className="flex items-center text-green-500 text-sm">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>{card.change}</span>
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">{card.value}</div>
              <div className="text-muted-foreground text-sm">{card.label}</div>
              <div className="text-xs text-muted-foreground/70 mt-1">
                {card.changeLabel}
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* 最近活动 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:col-span-2 bg-card/50 rounded-xl border border-white/10 p-6"
        >
          <h2 className="text-lg font-semibold mb-6">最近活动</h2>
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
                <span className="font-medium">查看留言</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
          </div>
        </motion.div>
      </div>

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
          所有修改都会实时同步到前端网站。如果有任何问题，随时联系技术支持。
        </p>
      </motion.div>
    </div>
  )
}

export default AdminDashboard
