import { supabase } from '../_lib/supabase'
import { requireAuth } from '../_lib/auth'
import { apiHandler, success, error } from '../_lib/response'

export default apiHandler(async (req, res) => {
  if (req.method !== 'PUT') {
    return error(res, '方法不允许', 405)
  }

  requireAuth(req)

  const { photos } = req.body

  if (!photos || !Array.isArray(photos)) {
    return error(res, '请提供照片排序数组', 400)
  }

  // 批量更新 sort_order
  const updates = photos.map((photo, index) =>
    supabase
      .from('photos')
      .update({ 
        sort_order: index,
        is_featured: photo.is_featured
      })
      .eq('id', photo.id)
  )

  await Promise.all(updates)

  return success(res, { message: '排序更新成功' })
})
