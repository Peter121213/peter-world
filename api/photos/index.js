import { formidable } from 'formidable'
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
  // GET - 获取照片列表
  if (req.method === 'GET') {
    const { category, featured } = req.query

    let query = supabase.from('photos').select('*')

    if (category && category !== '全部') {
      query = query.eq('category', category)
    }

    if (featured === 'true') {
      query = query.eq('is_featured', true)
    }

    query = query.order('created_at', { ascending: false })

    const { data: photos, error: dbError } = await query

    if (dbError) {
      console.error('Supabase Error:', dbError)
      return error(res, `获取照片失败: ${dbError.message || JSON.stringify(dbError)}`)
    }

    return success(res, { photos })
  }

  // POST - 上传照片
  if (req.method === 'POST') {
    requireAuth(req)

    // 解析表单数据
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB
    })

    const [fields, files] = await form.parse(req)

    const title = fields.title?.[0]
    const description = fields.description?.[0] || ''
    const category = fields.category?.[0] || '风景'
    const isFeatured = fields.isFeatured?.[0] === 'true'

    if (!title) {
      return error(res, '请提供照片标题', 400)
    }

    if (!files.image || !files.image[0]) {
      return error(res, '请上传图片文件', 400)
    }

    const imageFile = files.image[0]
    const fileExt = imageFile.originalFilename.split('.').pop()
    const fileName = `photos/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`

    // 上传到 R2
    const fs = await import('fs')
    const fileBuffer = fs.readFileSync(imageFile.filepath)

    await uploadFile(fileName, fileBuffer, imageFile.mimetype)

    const imageUrl = `/api/files/${fileName}`

    // 保存到数据库
    const { data: photo, error: dbError } = await supabase
      .from('photos')
      .insert({
        title,
        description,
        image_url: imageUrl,
        category,
        is_featured: isFeatured,
      })
      .select()
      .single()

    if (dbError) {
      // 数据库插入失败，删除 R2 中的文件
      await deleteFile(fileName).catch(() => {})
      return error(res, '保存照片失败')
    }

    return success(res, { photo }, 201)
  }

  return error(res, '方法不允许', 405)
})
