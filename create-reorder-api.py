import os

# 创建照片排序 API
photos_reorder_path = 'E:/桌面/peter-world/api/photos/reorder.js'
photos_reorder_code = """import { supabase } from '../_lib/supabase'
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
"""

with open(photos_reorder_path, 'w', encoding='utf-8') as f:
    f.write(photos_reorder_code)
print('照片排序API创建成功')

# 创建音乐排序 API
music_reorder_path = 'E:/桌面/peter-world/api/music/reorder.js'
music_reorder_code = """import { supabase } from '../_lib/supabase'
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
"""

with open(music_reorder_path, 'w', encoding='utf-8') as f:
    f.write(music_reorder_code)
print('音乐排序API创建成功')
