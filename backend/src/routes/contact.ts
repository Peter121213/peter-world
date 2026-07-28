import { Router } from 'express'
import db from '../database'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = Router()

// 提交联系表单
router.post('/', (req, res) => {
  const { name, email, message } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({ error: '请填写所有必填字段' })
  }

  // 简单的邮箱格式验证
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: '请输入有效的邮箱地址' })
  }

  const result = db
    .prepare(
      'INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)'
    )
    .run(name, email, message)

  const messageRecord = db
    .prepare('SELECT id, name, email, message, created_at FROM contact_messages WHERE id = ?')
    .get(result.lastInsertRowid)

  res.status(201).json({
    message: '留言提交成功',
    data: messageRecord,
  })
})

// 获取所有留言（需要认证）
router.get('/messages', authMiddleware, (req: AuthRequest, res) => {
  const messages = db
    .prepare(
      'SELECT id, name, email, message, created_at FROM contact_messages ORDER BY created_at DESC'
    )
    .all()

  res.json({ messages })
})

// 删除留言（需要认证）
router.delete('/messages/:id', authMiddleware, (req: AuthRequest, res) => {
  const { id } = req.params

  const message = db
    .prepare('SELECT id FROM contact_messages WHERE id = ?')
    .get(id)

  if (!message) {
    return res.status(404).json({ error: '留言不存在' })
  }

  db.prepare('DELETE FROM contact_messages WHERE id = ?').run(id)

  res.json({ message: '留言已删除' })
})

export default router
