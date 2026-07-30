import { supabase } from '../_lib/supabase'
import { requireAuth } from '../_lib/auth'
import { apiHandler, success, error } from '../_lib/response'

export default apiHandler(async (req, res) => {
  requireAuth(req)

  const { id } = req.query

  // 如果有 id，处理单条留言
  if (id) {
    // GET - 获取单条留言
    if (req.method === 'GET') {
      const { data: message, error: dbError } = await supabase
        .from('contact_messages')
        .select('*')
        .eq('id', id)
        .single()

      if (dbError) {
        return error(res, '获取留言失败')
      }

      return success(res, { message })
    }

    // DELETE - 删除留言
    if (req.method === 'DELETE') {
      const { error: dbError } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id)

      if (dbError) {
        return error(res, '删除留言失败')
      }

      return success(res, { message: '删除成功' })
    }

    return error(res, '方法不允许', 405)
  }

  // 没有 id，处理列表
  // GET - 获取留言列表
  if (req.method === 'GET') {
    const { data: messages, error: dbError } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })

    if (dbError) {
      return error(res, '获取留言列表失败')
    }

    return success(res, { messages })
  }

  return error(res, '方法不允许', 405)
})
