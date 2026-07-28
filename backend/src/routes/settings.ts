import { Router } from 'express'
import db from '../database'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = Router()

// 获取网站设置
router.get('/', (req, res) => {
  const settingsRows = db.prepare('SELECT key, value FROM site_settings').all() as {
    key: string
    value: string
  }[]

  const settings: Record<string, string> = {}
  settingsRows.forEach((row) => {
    settings[row.key] = row.value
  })

  res.json({ settings })
})

// 更新网站设置（需要认证）
router.put('/', authMiddleware, (req: AuthRequest, res) => {
  const updates = req.body

  const updateStmt = db.prepare(
    'INSERT INTO site_settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value'
  )

  const updateMany = db.transaction((items: Record<string, string>) => {
    Object.entries(items).forEach(([key, value]) => {
      updateStmt.run(key, value)
    })
  })

  updateMany(updates)

  // 返回更新后的设置
  const settingsRows = db.prepare('SELECT key, value FROM site_settings').all() as {
    key: string
    value: string
  }[]

  const settings: Record<string, string> = {}
  settingsRows.forEach((row) => {
    settings[row.key] = row.value
  })

  res.json({ settings })
})

export default router
