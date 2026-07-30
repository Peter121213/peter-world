import { supabase } from '../_lib/supabase'
import { deleteFile } from '../_lib/r2'
import { requireAuth } from '../_lib/auth'
import { apiHandler, success, error } from '../_lib/response'

export default apiHandler(async (req, res) => {
  const id = req.query.id

  // GET - 获取单首音乐
  if (req.method === 'GET') {
    const { data: track, error: dbError } = await supabase
      .from('music_tracks')
      .select('*')
      .eq('id', id)
      .single()

    if (dbError || !track) {
      return error(res, '音乐不存在', 404)
    }

    return success(res, { track })
  }

  // PUT - 更新音乐
  if (req.method === 'PUT') {
    requireAuth(req)

    const { title, artist, duration } = req.body

    const updateData = {}
    if (title !== undefined) updateData.title = title
    if (artist !== undefined) updateData.artist = artist
    if (duration !== undefined) updateData.duration = duration

    const { data: track, error: dbError } = await supabase
      .from('music_tracks')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (dbError) {
      return error(res, '更新音乐失败')
    }

    return success(res, { track })
  }

  // DELETE - 删除音乐
  if (req.method === 'DELETE') {
    requireAuth(req)

    const { data: track, error: dbError } = await supabase
      .from('music_tracks')
      .select('*')
      .eq('id', id)
      .single()

    if (dbError || !track) {
      return error(res, '音乐不存在', 404)
    }

    // 删除 R2 中的音频文件
    const audioPath = track.audio_url.replace('/api/files/', '')
    await deleteFile(audioPath).catch(() => {})

    // 删除封面图（如果有）
    if (track.cover_url) {
      const coverPath = track.cover_url.replace('/api/files/', '')
      await deleteFile(coverPath).catch(() => {})
    }

    // 删除数据库记录
    await supabase.from('music_tracks').delete().eq('id', id)

    return success(res, { message: '音乐已删除' })
  }

  return error(res, '方法不允许', 405)
})
