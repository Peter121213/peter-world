// 成功响应
export function success(res, data, statusCode = 200) {
  res.status(statusCode).json(data)
}

// 错误响应
export function error(res, message, statusCode = 500) {
  res.status(statusCode).json({ error: message })
}

// 处理 API 函数的包装器，统一处理错误
export function apiHandler(handler) {
  return async (req, res) => {
    try {
      // 设置 CORS 头
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, X-Auth-Token'
      )

      // 处理 OPTIONS 预检请求
      if (req.method === 'OPTIONS') {
        return res.status(200).end()
      }

      await handler(req, res)
    } catch (err) {
      console.error('API Error:', err)
      const statusCode = err.statusCode || 500
      const message = err.message || '服务器内部错误'
      error(res, message, statusCode)
    }
  }
}
