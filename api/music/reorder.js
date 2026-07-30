import { supabase } from '../_lib/supabase'
import { requireAuth } from '../_lib/auth'
import { apiHandler, success, error } from '../_lib/response'

export default apiHandler(async (req, res) => {
  if (req.method !== 'PUT') {
    return error(res, '方法不允许', 405)
  }

  requireAuth(req)

  const { tracks } = req.body

  if (!tracks || !Array.isArray(tracks)) {
    return error(res, '请提供音乐排序数组', 400)
  }

  // 批量更新 sort_order
  const updates = tracks.map((track, index) =>
    supabase
      .from('music_tracks')
      .update({ sort_order: index })
      .eq('id', track.id)
  )

  await Promise.all(updates)

  return success(res, { message: '排序更新成功' })
})
