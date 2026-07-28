import { verifyAuth } from '../_lib/auth'
import { apiHandler, success, error } from '../_lib/response'

export default apiHandler(async (req, res) => {
  if (req.method !== 'GET') {
    return error(res, '方法不允许', 405)
  }

  const user = verifyAuth(req)

  if (!user) {
    return error(res, '无效的 token', 401)
  }

  return success(res, {
    valid: true,
    user: {
      id: user.userId,
      username: user.username,
    },
  })
})
