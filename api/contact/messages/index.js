import { supabase } from '../../_lib/supabase'
import { requireAuth } from '../../_lib/auth'
import { apiHandler, success, error } from '../../_lib/response'

export default apiHandler(async (req, res) => {
  if (req.method !== 'GET') {
    return error(res, '方法不允许', 405)
  }

  requireAuth(req)

  const { data: messages, error: dbError } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })

  if (dbError) {
    return error(res, '获取留言列表失败')
  }

  return success(res, { messages })
})
