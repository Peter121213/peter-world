import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../database'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'peter-world-secret-key-2024'

// 登录
router.post('/login', (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ error: '请提供用户名和密码' })
  }

  const user = db
    .prepare('SELECT * FROM users WHERE username = ?')
    .get(username) as { id: number; username: string; password_hash: string } | undefined

  if (!user) {
    return res.status(401).json({ error: '用户名或密码错误' })
  }

  const isValidPassword = bcrypt.compareSync(password, user.password_hash)

  if (!isValidPassword) {
    return res.status(401).json({ error: '用户名或密码错误' })
  }

  const token = jwt.sign(
    { userId: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: '7d' }
  )

  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
    },
  })
})

// 验证 token
router.get('/verify', authMiddleware, (req: AuthRequest, res) => {
  res.json({
    valid: true,
    user: {
      id: req.userId,
      username: req.username,
    },
  })
})

export default router
