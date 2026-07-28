import { supabase } from '../_lib/supabase'
import { apiHandler, success, error } from '../_lib/response'

export default apiHandler(async (req, res) => {
  if (req.method !== 'POST') {
    return error(res, '方法不允许', 405)
  }

  const { name, email, message } = req.body

  if (!name || !email || !message) {
    return error(res, '请填写完整信息', 400)
  }

  const { data: newMessage, error: dbError } = await supabase
    .from('contact_messages')
    .insert({
      name,
      email,
      message,
    })
    .select()
    .single()

  if (dbError) {
    return error(res, '提交留言失败')
  }

  return success(res, { message: '留言提交成功！', data: newMessage }, 201)
})
