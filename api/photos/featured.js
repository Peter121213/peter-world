import { supabase } from '../_lib/supabase'
import { apiHandler, success, error } from '../_lib/response'

export default apiHandler(async (req, res) => {
  if (req.method !== 'GET') {
    return error(res, '方法不允许', 405)
  }

  const { data: photos, error: dbError } = await supabase
    .from('photos')
    .select('*')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(6)

  if (dbError) {
    return error(res, '获取精选照片失败')
  }

  return success(res, { photos })
})
