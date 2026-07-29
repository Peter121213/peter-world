import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'peter-world-secret-key-2024'

// 验证 JWT token
export function verifyAuth(req) {
  const authHeader = req.headers.authorization || req.headers.Authorization

  console.log('Auth header:', authHeader ? authHeader.substring(0, 20) + '...' : 'none')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('No auth header or invalid format')
    return null
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    console.log('Token verified:', decoded)
    return decoded
  } catch (error) {
    console.log('Token verify failed:', error.message)
    return null
  }
}

// 生成 JWT token
export function generateToken(userId, username) {
  return jwt.sign(
    { userId, username },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

// 要求认证的辅助函数
export function requireAuth(req) {
  const user = verifyAuth(req)
  if (!user) {
    const error = new Error('未授权')
    error.statusCode = 401
    throw error
  }
  return user
}
