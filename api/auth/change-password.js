import bcrypt from 'bcryptjs'
import { supabase } from '../_lib/supabase'
import { requireAuth } from '../_lib/auth'
import { apiHandler, success, error } from '../_lib/response'

export default apiHandler(async (req, res) => {
  if (req.method !== 'POST') {
    return error(res, '方法不允许', 405)
  }

  // 验证登录
  const user = requireAuth(req)
  if (!user) {
    return error(res, '请先登录', 401)
  }

  const { oldPassword, newPassword } = req.body

  if (!oldPassword || !newPassword) {
    return error(res, '请提供旧密码和新密码', 400)
  }

  // 密码强度校验
  if (newPassword.length < 6) {
    return error(res, '新密码长度不能少于6位', 400)
  }

  // 查询用户
  const { data: dbUser, error: dbError } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.userId)
    .single()

  if (dbError || !dbUser) {
    return error(res, '用户不存在', 404)
  }

  // 验证旧密码
  const isValidPassword = bcrypt.compareSync(oldPassword, dbUser.password_hash)

  if (!isValidPassword) {
    return error(res, '旧密码错误', 400)
  }

  // 加密新密码
  const newPasswordHash = bcrypt.hashSync(newPassword, 10)

  // 更新密码
  const { error: updateError } = await supabase
    .from('users')
    .update({ password_hash: newPasswordHash })
    .eq('id', user.userId)

  if (updateError) {
    return error(res, '修改密码失败')
  }

  return success(res, { message: '密码修改成功' })
})
