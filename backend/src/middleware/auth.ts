import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'peter-world-secret-key-2024'

export interface AuthRequest extends Request {
  userId?: number
  username?: string
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: '未提供认证令牌' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: number
      username: string
    }
    req.userId = decoded.userId
    req.username = decoded.username
    next()
  } catch (error) {
    return res.status(401).json({ error: '无效的认证令牌' })
  }
}
