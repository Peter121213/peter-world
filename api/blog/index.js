import { supabase } from '../_lib/supabase'
import { uploadFile, deleteFile } from '../_lib/r2'
import { requireAuth } from '../_lib/auth'
import { apiHandler, success, error } from '../_lib/response'

export const config = {
  api: {
    bodyParser: false, // 禁用默认 body parser，用 formidable 处理文件上传
  },
}

export default apiHandler(async (req, res) => {
  const { id } = req.query

  // 如果有 id，处理单条随笔
  if (id) {
    // GET - 获取单条随笔
    if (req.method === 'GET') {
      const { data: post, error: dbError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single()

      if (dbError) {
        return error(res, '获取随笔失败')
      }

      return success(res, { post })
    }

    // PUT - 更新随笔
    if (req.method === 'PUT') {
      requireAuth(req)

      // 解析表单数据（支持上传封面图）
      const { formidable } = await import('formidable')
      const form = formidable({
        maxFileSize: 10 * 1024 * 1024, // 10MB
      })

      const [fields, files] = await form.parse(req)

      const title = fields.title?.[0]
      const content = fields.content?.[0] || ''
      const coverImage = fields.coverImage?.[0] || ''

      if (!title) {
        return error(res, '请提供标题', 400)
      }

      let updateData: any = {
        title,
        content,
        updated_at: new Date().toISOString(),
      }

      // 如果有上传新的封面图
      if (files.coverImage && files.coverImage[0]) {
        const imageFile = files.coverImage[0]
        const fileExt = imageFile.originalFilename.split('.').pop()
        const fileName = `blog/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`

        // 上传到 R2
        const fs = await import('fs')
        const fileBuffer = fs.readFileSync(imageFile.filepath)
        await uploadFile(fileName, fileBuffer, imageFile.mimetype)

        updateData.cover_image = `/api/files/${fileName}`
      } else if (coverImage) {
        // 如果是直接填的 URL
        updateData.cover_image = coverImage
      }

      const { data: post, error: dbError } = await supabase
        .from('blog_posts')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (dbError) {
        return error(res, '更新随笔失败')
      }

      return success(res, { post })
    }

    // DELETE - 删除随笔
    if (req.method === 'DELETE') {
      requireAuth(req)

      // 先查一下封面图，删除的时候一起删
      const { data: post } = await supabase
        .from('blog_posts')
        .select('cover_image')
        .eq('id', id)
        .single()

      const { error: dbError } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id)

      if (dbError) {
        return error(res, '删除随笔失败')
      }

      // 删除封面图
      if (post?.cover_image && post.cover_image.startsWith('/api/files/')) {
        const fileName = post.cover_image.replace('/api/files/', '')
        await deleteFile(fileName).catch(() => {})
      }

      return success(res, { message: '删除成功' })
    }

    return error(res, '方法不允许', 405)
  }

  // 没有 id，处理列表
  // GET - 获取随笔列表
  if (req.method === 'GET') {
    const { limit } = req.query

    let query = supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (limit) {
      query = query.limit(parseInt(limit as string))
    }

    const { data: posts, error: dbError } = await query

    if (dbError) {
      console.error('Supabase Error:', dbError)
      return error(res, `获取随笔列表失败: ${dbError.message || JSON.stringify(dbError)}`)
    }

    return success(res, { posts })
  }

  // POST - 新增随笔
  if (req.method === 'POST') {
    requireAuth(req)

    // 解析表单数据（支持上传封面图）
    const { formidable } = await import('formidable')
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB
    })

    const [fields, files] = await form.parse(req)

    const title = fields.title?.[0]
    const content = fields.content?.[0] || ''
    const coverImage = fields.coverImage?.[0] || ''

    if (!title) {
      return error(res, '请提供标题', 400)
    }

    let coverImageUrl = ''

    // 如果有上传封面图
    if (files.coverImage && files.coverImage[0]) {
      const imageFile = files.coverImage[0]
      const fileExt = imageFile.originalFilename.split('.').pop()
      const fileName = `blog/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`

      // 上传到 R2
      const fs = await import('fs')
      const fileBuffer = fs.readFileSync(imageFile.filepath)
      await uploadFile(fileName, fileBuffer, imageFile.mimetype)

      coverImageUrl = `/api/files/${fileName}`
    } else if (coverImage) {
      // 如果是直接填的 URL
      coverImageUrl = coverImage
    }

    const { data: post, error: dbError } = await supabase
      .from('blog_posts')
      .insert({
        title,
        content,
        cover_image: coverImageUrl,
      })
      .select()
      .single()

    if (dbError) {
      return error(res, '创建随笔失败')
    }

    return success(res, { post }, 201)
  }

  return error(res, '方法不允许', 405)
})
