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

async function readRawBody(req) {
  let body = ''
  for await (const chunk of req) {
    body += chunk.toString()
  }
  return body
}

async function updateTrackById(res, id, fields, files) {
  const updateData = {}
  let newCoverPath = null

  if (fields.title?.[0] !== undefined) updateData.title = fields.title[0]
  if (fields.artist?.[0] !== undefined) updateData.artist = fields.artist[0]
  if (fields.lyrics?.[0] !== undefined) updateData.lyrics = fields.lyrics[0]
  if (fields.duration?.[0] !== undefined) {
    updateData.duration = parseInt(fields.duration[0], 10) || 0
  }

  if (files?.cover?.[0]) {
    const coverFile = files.cover[0]
    const coverExt = (coverFile.originalFilename || 'cover.jpg').split('.').pop()
    const coverName = `music/covers/${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${coverExt}`
    const fs = await import('fs')
    const coverBuffer = fs.readFileSync(coverFile.filepath)
    await uploadFile(coverName, coverBuffer, coverFile.mimetype || 'image/jpeg')
    updateData.cover_url = `/api/files/${coverName}`
    newCoverPath = coverName
  }

  if (Object.keys(updateData).length === 0) {
    return error(res, '没有可更新的内容', 400)
  }

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
    console.error('更新音乐数据库失败:', dbError)
    if (newCoverPath) {
      await deleteFile(newCoverPath).catch(() => {})
    }
    return error(res, '更新音乐失败: ' + (dbError.message || '数据库错误'))
  }

  if (oldCoverPath && oldCoverPath !== newCoverPath) {
    await deleteFile(oldCoverPath).catch(() => {})
  }

  return success(res, { track })
}

export default apiHandler(async (req, res) => {
  const id = Array.isArray(req.query?.id) ? req.query.id[0] : req.query?.id

  // GET - 公开：单首或列表（不需要登录）
  if (req.method === 'GET') {
    if (id) {
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

    const { data: tracks, error: dbError } = await supabase
      .from('music_tracks')
      .select('*')
      .order('sort_order', { ascending: true })

    if (dbError) {
      // sort_order 不存在时降级
      const fallback = await supabase
        .from('music_tracks')
        .select('*')
        .order('created_at', { ascending: true })
      if (fallback.error) {
        return error(res, '获取音乐列表失败')
      }
      return success(res, { tracks: fallback.data })
    }

    return success(res, { tracks })
  }

  // POST - 新建 或 更新（更新也走 POST，避免 Vercel 对 PUT+multipart 支持不佳）
  if (req.method === 'POST') {
    const form = formidable({
      maxFileSize: 20 * 1024 * 1024,
      multiples: false,
    })

    let fields
    let files
    try {
      ;[fields, files] = await form.parse(req)
    } catch (parseErr) {
      console.error('解析表单失败:', parseErr)
      return error(res, '上传内容解析失败，请压缩封面后重试', 400)
    }

    // 鉴权：query / header / 表单字段均可
    requireAuth(req, fields.token?.[0])

    const action = fields.action?.[0]
    const updateId = fields.id?.[0] || (action === 'update' ? id : null)

    // —— 更新已有歌曲（封面 / 歌词，不需要音频）——
    if (updateId) {
      return updateTrackById(res, updateId, fields, files)
    }

    // —— 新建歌曲 ——
    const title = fields.title?.[0]
    const artist = fields.artist?.[0] || 'Peter'
    const duration = parseInt(fields.duration?.[0], 10) || 0
    const lyrics = fields.lyrics?.[0] || ''

    if (!title) {
      return error(res, '请提供音乐标题', 400)
    }

    if (!files.audio || !files.audio[0]) {
      return error(res, '请上传音乐文件', 400)
    }

    const audioFile = files.audio[0]
    const fileExt = (audioFile.originalFilename || 'audio.mp3').split('.').pop()
    const fileName = `music/${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${fileExt}`

    const fs = await import('fs')
    const fileBuffer = fs.readFileSync(audioFile.filepath)
    await uploadFile(fileName, fileBuffer, audioFile.mimetype || 'audio/mpeg')
    const audioUrl = `/api/files/${fileName}`

    let coverUrl = null
    if (files.cover && files.cover[0]) {
      const coverFile = files.cover[0]
      const coverExt = (coverFile.originalFilename || 'cover.jpg').split('.').pop()
      const coverName = `music/covers/${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${coverExt}`
      const coverBuffer = fs.readFileSync(coverFile.filepath)
      await uploadFile(coverName, coverBuffer, coverFile.mimetype || 'image/jpeg')
      coverUrl = `/api/files/${coverName}`
    }

    const { data: track, error: dbError } = await supabase
      .from('music_tracks')
      .insert({
        title,
        artist,
        audio_url: audioUrl,
        cover_url: coverUrl,
        duration,
        lyrics,
      })
      .select()
      .single()

    if (dbError) {
      console.error('保存音乐失败:', dbError)
      await deleteFile(fileName).catch(() => {})
      if (coverUrl) {
        await deleteFile(coverUrl.replace('/api/files/', '')).catch(() => {})
      }
      return error(res, '保存音乐失败: ' + (dbError.message || '请确认已添加 lyrics 字段'))
    }

    return success(res, { track }, 201)
  }

  // PUT - 仅批量排序（JSON）
  if (req.method === 'PUT') {
    const raw = await readRawBody(req)
    let parsed = {}
    try {
      parsed = JSON.parse(raw || '{}')
    } catch {
      return error(res, '无效的请求数据', 400)
    }
    requireAuth(req, parsed.token)

    const { tracks } = parsed
    if (!tracks || !Array.isArray(tracks)) {
      return error(res, '请提供音乐排序数组', 400)
    }

    await Promise.all(
      tracks.map((track, index) =>
        supabase
          .from('music_tracks')
          .update({ sort_order: index })
          .eq('id', track.id)
      )
    )

    return success(res, { message: '排序更新成功' })
  }

  // DELETE
  if (req.method === 'DELETE') {
    requireAuth(req)

    if (!id) {
      return error(res, '缺少音乐 ID', 400)
    }

    const { data: track, error: dbError } = await supabase
      .from('music_tracks')
      .select('*')
      .eq('id', id)
      .single()

    if (dbError || !track) {
      return error(res, '音乐不存在', 404)
    }

    await deleteFile(track.audio_url.replace('/api/files/', '')).catch(() => {})
    if (track.cover_url) {
      await deleteFile(track.cover_url.replace('/api/files/', '')).catch(() => {})
    }
    await supabase.from('music_tracks').delete().eq('id', id)

    return success(res, { message: '音乐已删除' })
  }

  return error(res, '方法不允许', 405)
})
