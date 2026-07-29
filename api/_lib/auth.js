import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'peter-world-secret-key-2024'

// 验证 JWT token
export function verifyAuth(req) {
  // 从 cookie 读取 token（避免 VPN/代理软件替换请求头）
  let token = null
  
  // 先尝试从 cookie 读取
  if (req.headers.cookie) {
    const cookies = req.headers.cookie.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=')
      acc[key] = value
      return acc
    }, {})
    token = cookies.peter_world_token
  }
  
  // 如果 cookie 里没有，再尝试从 X-Auth-Token 头读取（兼容旧版本）
  if (!token) {
    token = req.headers['x-auth-token'] || req.headers['X-Auth-Token']
  }

  console.log('Token source:', req.headers.cookie ? 'cookie' : 'header')
  console.log('Token exists:', !!token)
  console.log('Token length:', token ? token.length : 0)

  if (!token) {
    console.log('No token found')
    return null
  }

  // 清理 token：去掉所有空白字符（换行、空格等）
  const cleanToken = token.replace(/\s/g, '')
  
  console.log('Clean token length:', cleanToken.length)
  console.log('Token dots count:', (cleanToken.match(/\./g) || []).length)
  console.log('Token start:', cleanToken.substring(0, 10))
  console.log('Token end:', cleanToken.substring(cleanToken.length - 10))

  try {
    const decoded = jwt.verify(cleanToken, JWT_SECRET)
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
