import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { initDatabase } from './database'

import authRoutes from './routes/auth'
import photosRoutes from './routes/photos'
import musicRoutes from './routes/music'
import settingsRoutes from './routes/settings'
import contactRoutes from './routes/contact'

const app = express()
const PORT = process.env.PORT || 3001

// 中间件
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 静态文件服务
const uploadsDir = path.join(__dirname, '..', 'uploads')
app.use('/uploads', express.static(uploadsDir))

// 初始化数据库
initDatabase()

// 路由
app.use('/api/auth', authRoutes)
app.use('/api/photos', photosRoutes)
app.use('/api/music', musicRoutes)
app.use('/api/settings', settingsRoutes)
app.use('/api/contact', contactRoutes)

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// 错误处理中间件
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack)
    res.status(500).json({ error: '服务器内部错误' })
  }
)

app.listen(PORT, () => {
  console.log(`🚀 服务器运行在 http://localhost:${PORT}`)
  console.log(`📁 上传文件目录: ${uploadsDir}`)
  console.log(`🔐 默认管理员账号: admin / admin123`)
})
