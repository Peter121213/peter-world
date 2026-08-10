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

async function updateTrackById(req, res, id, fields, files) {
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
    const coverExt = coverFile.originalFilename.split('.').pop()
    const coverName = `music/covers/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${coverExt}`
    const fs = await import('fs')
    const coverBuffer = fs.readFileSync(coverFile.filepath)
    await uploadFile(coverName, coverBuffer, coverFile.mimetype)
    updateData.cover_url = `/api/files/${coverName}`
    newCoverPath = coverName
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

export default apiHandler(async (req, res) => {
  const id = Array.isArray(req.query?.id) ? req.query.id[0] : req.query?.id

  // GET - 单首或列表
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
      return error(res, '获取音乐列表失败')
    }

    return success(res, { tracks })
  }

  // POST - 上传音乐
  if (req.method === 'POST') {
    requireAuth(req)

    const form = formidable({
      maxFileSize: 20 * 1024 * 1024,
    })

    const [fields, files] = await form.parse(req)

    const title = fields.title?.[0]
    const artist = fields.artist?.[0] || 'Peter'
    const duration = parseInt(fields.duration?.[0]) || 0
    const lyrics = fields.lyrics?.[0] || ''

    if (!title) {
      return error(res, '请提供音乐标题', 400)
    }

    if (!files.audio || !files.audio[0]) {
      return error(res, '请上传音乐文件', 400)
    }

    const audioFile = files.audio[0]
    const fileExt = audioFile.originalFilename.split('.').pop()
    const fileName = `music/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`

    const fs = await import('fs')
    const fileBuffer = fs.readFileSync(audioFile.filepath)

    await uploadFile(fileName, fileBuffer, audioFile.mimetype)

    const audioUrl = `/api/files/${fileName}`

    let coverUrl = null
    if (files.cover && files.cover[0]) {
      const coverFile = files.cover[0]
      const coverExt = coverFile.originalFilename.split('.').pop()
      const coverName = `music/covers/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${coverExt}`

      const coverBuffer = fs.readFileSync(coverFile.filepath)
      await uploadFile(coverName, coverBuffer, coverFile.mimetype)
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
      await deleteFile(fileName).catch(() => {})
      if (coverUrl) {
        const coverPath = coverUrl.replace('/api/files/', '')
        await deleteFile(coverPath).catch(() => {})
      }
      return error(res, '保存音乐失败')
    }

    return success(res, { track }, 201)
  }

  // PUT - 有 id 则更新单首；否则批量排序
  if (req.method === 'PUT') {
    const contentType = req.headers['content-type'] || ''

    if (id) {
      // 单首更新：先解析 body，再用 query/header/form token 鉴权
      if (contentType.includes('multipart/form-data')) {
        const form = formidable({
          maxFileSize: 10 * 1024 * 1024,
        })
        const [fields, files] = await form.parse(req)
        requireAuth(req, fields.token?.[0])
        return updateTrackById(req, res, id, fields, files)
      }

      const raw = await readRawBody(req)
      let body = {}
      try {
        body = JSON.parse(raw || '{}')
      } catch {
        return error(res, '无效的请求数据', 400)
      }
      requireAuth(req, body.token)

      const fields = {
        title: body.title !== undefined ? [body.title] : undefined,
        artist: body.artist !== undefined ? [body.artist] : undefined,
        lyrics: body.lyrics !== undefined ? [body.lyrics] : undefined,
        duration: body.duration !== undefined ? [String(body.duration)] : undefined,
      }
      return updateTrackById(req, res, id, fields, null)
    }

    // 批量排序
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

    const updates = tracks.map((track, index) =>
      supabase
        .from('music_tracks')
        .update({ sort_order: index })
        .eq('id', track.id)
    )

    await Promise.all(updates)

    return success(res, { message: '排序更新成功' })
  }

  // DELETE - 删除单首
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

    const audioPath = track.audio_url.replace('/api/files/', '')
    await deleteFile(audioPath).catch(() => {})

    if (track.cover_url) {
      const coverPath = track.cover_url.replace('/api/files/', '')
      await deleteFile(coverPath).catch(() => {})
    }

    await supabase.from('music_tracks').delete().eq('id', id)

    return success(res, { message: '音乐已删除' })
  }

  return error(res, '方法不允许', 405)
})
