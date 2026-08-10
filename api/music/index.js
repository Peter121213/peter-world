import { formidable } from 'formidable'
import { supabase } from '../_lib/supabase'
import { uploadFile, deleteFile } from '../_lib/r2'
import { requireAuth } from '../_lib/auth'
import { apiHandler, success, error } from '../_lib/response'

export const config = {
  api: {
    bodyParser: false, // 禁用默认 body parser
  },
}

export default apiHandler(async (req, res) => {
  // GET - 获取音乐列表
  if (req.method === 'GET') {
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
    console.log('POST /api/music called')
    console.log('Content-Type:', req.headers['content-type'])
    console.log('Content-Length:', req.headers['content-length'])
    
    requireAuth(req)
    
    console.log('Auth passed, parsing form...')

    const form = formidable({
      maxFileSize: 20 * 1024 * 1024, // 20MB
    })

    const [fields, files] = await form.parse(req)
    
    console.log('Form parsed successfully')
    console.log('Fields:', Object.keys(fields))
    console.log('Files:', Object.keys(files))

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

    // 上传到 R2
    const fs = await import('fs')
    const fileBuffer = fs.readFileSync(audioFile.filepath)

    await uploadFile(fileName, fileBuffer, audioFile.mimetype)

    const audioUrl = `/api/files/${fileName}`

    // 处理封面图（可选；存于 music/covers，不会进入照片库）
    let coverUrl = null
    if (files.cover && files.cover[0]) {
      const coverFile = files.cover[0]
      const coverExt = coverFile.originalFilename.split('.').pop()
      const coverName = `music/covers/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${coverExt}`

      const coverBuffer = fs.readFileSync(coverFile.filepath)
      await uploadFile(coverName, coverBuffer, coverFile.mimetype)
      coverUrl = `/api/files/${coverName}`
    }

    // 保存到数据库
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
      // 数据库插入失败，删除 R2 中的文件
      await deleteFile(fileName).catch(() => {})
      if (coverUrl) {
        const coverPath = coverUrl.replace('/api/files/', '')
        await deleteFile(coverPath).catch(() => {})
      }
      return error(res, '保存音乐失败')
    }

    return success(res, { track }, 201)
  }

  // PUT - 批量更新排序
  if (req.method === 'PUT') {
    requireAuth(req)

    // 手动解析 JSON body（因为 bodyParser 被禁用了）
    let body = ''
    for await (const chunk of req) {
      body += chunk.toString()
    }
    const { tracks } = JSON.parse(body || '{}')

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
  }

  return error(res, '方法不允许', 405)
})
