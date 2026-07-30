import bcrypt from 'bcryptjs'
import { supabase } from '../_lib/supabase'
import { generateToken, verifyAuth } from '../_lib/auth'
import { apiHandler, success, error } from '../_lib/response'

export default apiHandler(async (req, res) => {
  // GET - 验证 token
  if (req.method === 'GET') {
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
  }

  // POST - 登录
  if (req.method !== 'POST') {
    return error(res, '方法不允许', 405)
  }

  const { username, password } = req.body

  if (!username || !password) {
    return error(res, '请提供用户名和密码', 400)
  }

  // 查询用户
  const { data: user, error: dbError } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single()

  if (dbError || !user) {
    return error(res, '用户名或密码错误', 401)
  }

  // 验证密码
  const isValidPassword = bcrypt.compareSync(password, user.password_hash)

  if (!isValidPassword) {
    return error(res, '用户名或密码错误', 401)
  }

  // 生成 token
  const token = generateToken(user.id, user.username)

  return success(res, {
    token,
    user: {
      id: user.id,
      username: user.username,
    },
  })
})
