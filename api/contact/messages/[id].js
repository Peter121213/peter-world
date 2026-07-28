import { supabase } from '../../../_lib/supabase'
import { requireAuth } from '../../../_lib/auth'
import { apiHandler, success, error } from '../../../_lib/response'

export default apiHandler(async (req, res) => {
  if (req.method !== 'DELETE') {
    return error(res, '方法不允许', 405)
  }

  requireAuth(req)

  const { id } = req.query

  const { error: dbError } = await supabase
    .from('contact_messages')
    .delete()
    .eq('id', id)

  if (dbError) {
    return error(res, '删除留言失败')
  }

  return success(res, { message: '留言已删除' })
})
