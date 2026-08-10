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

function firstQueryValue(value) {
  if (value == null) return null
  return Array.isArray(value) ? value[0] : value
}

/**
 * 验证 JWT。
 * 依次尝试：Cookie、X-Auth-Token、Authorization、query.token、body.token
 * （部分网络环境会改写自定义请求头，因此需要 query / body 兜底）
 */
export function verifyAuth(req, extraToken) {
  const candidates = []

  const cookies = parseCookies(req.headers.cookie)
  if (cookies.peter_world_token) {
    candidates.push(cookies.peter_world_token)
  }

  const headerToken =
    req.headers['x-auth-token'] ||
    req.headers['X-Auth-Token'] ||
    (typeof req.headers.authorization === 'string' &&
    req.headers.authorization.startsWith('Bearer ')
      ? req.headers.authorization.slice(7)
      : null)

  if (headerToken) {
    candidates.push(headerToken)
  }

  const queryToken = firstQueryValue(req.query?.token)
  if (queryToken) {
    candidates.push(queryToken)
  }

  if (extraToken) {
    candidates.push(extraToken)
  }

  if (req.body && typeof req.body === 'object' && req.body.token) {
    candidates.push(req.body.token)
  }

  for (const token of candidates) {
    const decoded = tryVerify(token)
    if (decoded) {
      return decoded
    }
  }

  return null
}

export function generateToken(userId, username) {
  return jwt.sign(
    { userId, username },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

export function requireAuth(req, extraToken) {
  const user = verifyAuth(req, extraToken)
  if (!user) {
    const error = new Error('未授权，请重新登录后再试')
    error.statusCode = 401
    throw error
  }
  return user
}
