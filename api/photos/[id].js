import { supabase } from '../_lib/supabase'
import { deleteFile } from '../_lib/r2'
import { requireAuth } from '../_lib/auth'
import { apiHandler, success, error } from '../_lib/response'

export default apiHandler(async (req, res) => {
  const { id } = req.query

  // GET - 获取单张照片
  if (req.method === 'GET') {
    const { data: photo, error: dbError } = await supabase
      .from('photos')
      .select('*')
      .eq('id', id)
      .single()

    if (dbError || !photo) {
      return error(res, '照片不存在', 404)
    }

    return success(res, { photo })
  }

  // PUT - 更新照片
  if (req.method === 'PUT') {
    requireAuth(req)

    const { title, description, category, is_featured } = req.body

    const updateData = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (category !== undefined) updateData.category = category
    if (is_featured !== undefined) updateData.is_featured = is_featured

    const { data: photo, error: dbError } = await supabase
      .from('photos')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (dbError) {
      return error(res, '更新照片失败')
    }

    return success(res, { photo })
  }

  // DELETE - 删除照片
  if (req.method === 'DELETE') {
    requireAuth(req)

    // 先查询照片信息
    const { data: photo, error: dbError } = await supabase
      .from('photos')
      .select('*')
      .eq('id', id)
      .single()

    if (dbError || !photo) {
      return error(res, '照片不存在', 404)
    }

    // 删除 R2 中的文件
    const filePath = photo.image_url.replace('/api/files/', '')
    await deleteFile(filePath).catch(() => {})

    // 删除数据库记录
    await supabase.from('photos').delete().eq('id', id)

    return success(res, { message: '照片已删除' })
  }

  return error(res, '方法不允许', 405)
})
