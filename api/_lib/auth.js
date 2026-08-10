import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'peter-world-secret-key-2024'

/** 解析 Cookie，只按第一个 = 分割，避免 JWT 中的 = 被截断 */
function parseCookies(cookieHeader) {
  const cookies = {}
  if (!cookieHeader) return cookies

  for (const part of cookieHeader.split(';')) {
    const trimmed = part.trim()
    if (!trimmed) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    const value = trimmed.slice(eq + 1).trim()
    try {
      cookies[key] = decodeURIComponent(value)
    } catch {
      cookies[key] = value
    }
  }
  return cookies
}

function tryVerify(token) {
  if (!token || typeof token !== 'string') return null
  const cleanToken = token.replace(/\s/g, '')
  if (!cleanToken) return null
  try {
    return jwt.verify(cleanToken, JWT_SECRET)
  } catch {
    return null
  }
}

// 验证 JWT token（cookie 与请求头都尝试，任一有效即可）
export function verifyAuth(req) {
  const candidates = []

  const cookies = parseCookies(req.headers.cookie)
  if (cookies.peter_world_token) {
    candidates.push(cookies.peter_world_token)
  }

  const headerToken =
    req.headers['x-auth-token'] ||
    req.headers['X-Auth-Token'] ||
    (req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.slice(7)
      : null)

  if (headerToken) {
    candidates.push(headerToken)
  }

  for (const token of candidates) {
    const decoded = tryVerify(token)
    if (decoded) {
      return decoded
    }
  }

  return null
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
