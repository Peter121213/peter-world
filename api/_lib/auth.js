import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'peter-world-secret-key-2024'

// 验证 JWT token
export function verifyAuth(req) {
  const authHeader = req.headers.authorization || req.headers.Authorization

  console.log('Auth header exists:', !!authHeader)
  console.log('Auth header length:', authHeader ? authHeader.length : 0)

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('No auth header or invalid format')
    return null
  }

  let token = authHeader.split(' ')[1]
  
  // 清理 token：去掉所有空白字符（换行、空格等）
  token = token.replace(/\s/g, '')
  
  console.log('Token length:', token.length)
  console.log('Token dots count:', (token.match(/\./g) || []).length)
  console.log('Token start:', token.substring(0, 10))
  console.log('Token end:', token.substring(token.length - 10))

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    console.log('Token verified successfully:', decoded.username)
    return decoded
  } catch (error) {
    console.log('Token verify failed:', error.message)
    console.log('Error name:', error.name)
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
