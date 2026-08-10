import { formidable } from 'formidable'
import { supabase } from '../_lib/supabase'
import { uploadFile, deleteFile } from '../_lib/r2'
import { requireAuth } from '../_lib/auth'
import { apiHandler, success, error } from '../_lib/response'

export const config = {
  api: {
    bodyParser: false,
  },
}

async function parseJsonBody(req) {
  let body = ''
  for await (const chunk of req) {
    body += chunk.toString()
  }
  return JSON.parse(body || '{}')
}

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

  // PUT - 更新音乐（JSON 或 multipart：可改标题/艺术家/歌词/封面）
  if (req.method === 'PUT') {
    requireAuth(req)

    const contentType = req.headers['content-type'] || ''
    const updateData = {}
    let newCoverPath = null

    if (contentType.includes('multipart/form-data')) {
      const form = formidable({
        maxFileSize: 10 * 1024 * 1024,
      })
      const [fields, files] = await form.parse(req)

      if (fields.title?.[0] !== undefined) updateData.title = fields.title[0]
      if (fields.artist?.[0] !== undefined) updateData.artist = fields.artist[0]
      if (fields.lyrics?.[0] !== undefined) updateData.lyrics = fields.lyrics[0]
      if (fields.duration?.[0] !== undefined) {
        updateData.duration = parseInt(fields.duration[0], 10) || 0
      }

      if (files.cover && files.cover[0]) {
        const coverFile = files.cover[0]
        const coverExt = coverFile.originalFilename.split('.').pop()
        const coverName = `music/covers/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${coverExt}`
        const fs = await import('fs')
        const coverBuffer = fs.readFileSync(coverFile.filepath)
        await uploadFile(coverName, coverBuffer, coverFile.mimetype)
        updateData.cover_url = `/api/files/${coverName}`
        newCoverPath = coverName
      }
    } else {
      const body = await parseJsonBody(req)
      const { title, artist, duration, lyrics } = body
      if (title !== undefined) updateData.title = title
      if (artist !== undefined) updateData.artist = artist
      if (duration !== undefined) updateData.duration = duration
      if (lyrics !== undefined) updateData.lyrics = lyrics
    }

    // 换封面前先取旧封面，便于清理
    let oldCoverPath = null
    if (updateData.cover_url) {
      const { data: existing } = await supabase
        .from('music_tracks')
        .select('cover_url')
        .eq('id', id)
        .single()
      if (existing?.cover_url) {
        oldCoverPath = existing.cover_url.replace('/api/files/', '')
      }
    }

    const { data: track, error: dbError } = await supabase
      .from('music_tracks')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (dbError) {
      if (newCoverPath) {
        await deleteFile(newCoverPath).catch(() => {})
      }
      return error(res, '更新音乐失败')
    }

    if (oldCoverPath && oldCoverPath !== newCoverPath) {
      await deleteFile(oldCoverPath).catch(() => {})
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
