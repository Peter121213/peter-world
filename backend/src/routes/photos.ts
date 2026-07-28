import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import db from '../database'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = Router()

// 配置文件上传
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', '..', 'uploads', 'photos')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  },
})

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/i
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    )
    const mimetype = allowedTypes.test(file.mimetype)

    if (extname && mimetype) {
      return cb(null, true)
    } else {
      cb(new Error('只允许上传图片文件'))
    }
  },
})

// 获取所有照片
router.get('/', (req, res) => {
  const { category, featured } = req.query

  let query = 'SELECT * FROM photos'
  const params: any[] = []
  const conditions: string[] = []

  if (category && category !== '全部') {
    conditions.push('category = ?')
    params.push(category)
  }

  if (featured === 'true') {
    conditions.push('is_featured = 1')
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ')
  }

  query += ' ORDER BY created_at DESC'

  const photos = db.prepare(query).all(...params)

  res.json({ photos })
})

// 获取精选照片
router.get('/featured', (req, res) => {
  const photos = db
    .prepare('SELECT * FROM photos WHERE is_featured = 1 ORDER BY created_at DESC LIMIT 6')
    .all()

  res.json({ photos })
})

// 按分类获取照片
router.get('/category/:category', (req, res) => {
  const { category } = req.params

  const photos = db
    .prepare('SELECT * FROM photos WHERE category = ? ORDER BY created_at DESC')
    .all(category)

  res.json({ photos })
})

// 获取单张照片
router.get('/:id', (req, res) => {
  const { id } = req.params

  const photo = db.prepare('SELECT * FROM photos WHERE id = ?').get(id)

  if (!photo) {
    return res.status(404).json({ error: '照片不存在' })
  }

  res.json({ photo })
})

// 上传照片（需要认证）
router.post(
  '/',
  authMiddleware,
  upload.single('image'),
  (req: AuthRequest, res) => {
    const { title, description, category, isFeatured } = req.body

    if (!title) {
      return res.status(400).json({ error: '请提供照片标题' })
    }

    if (!req.file) {
      return res.status(400).json({ error: '请上传图片文件' })
    }

    const imageUrl = `/uploads/photos/${req.file.filename}`

    const result = db
      .prepare(
        'INSERT INTO photos (title, description, image_url, category, is_featured) VALUES (?, ?, ?, ?, ?)'
      )
      .run(
        title,
        description || '',
        imageUrl,
        category || '风景',
        isFeatured === 'true' ? 1 : 0
      )

    const photo = db
      .prepare('SELECT * FROM photos WHERE id = ?')
      .get(result.lastInsertRowid)

    res.status(201).json({ photo })
  }
)

// 更新照片（需要认证）
router.put('/:id', authMiddleware, (req: AuthRequest, res) => {
  const { id } = req.params
  const { title, description, category, isFeatured } = req.body

  const photo = db.prepare('SELECT * FROM photos WHERE id = ?').get(id)

  if (!photo) {
    return res.status(404).json({ error: '照片不存在' })
  }

  db.prepare(
    `UPDATE photos SET 
      title = COALESCE(?, title),
      description = COALESCE(?, description),
      category = COALESCE(?, category),
      is_featured = COALESCE(?, is_featured)
    WHERE id = ?`
  ).run(
    title || null,
    description || null,
    category || null,
    isFeatured !== undefined ? (isFeatured ? 1 : 0) : null,
    id
  )

  const updatedPhoto = db.prepare('SELECT * FROM photos WHERE id = ?').get(id)

  res.json({ photo: updatedPhoto })
})

// 删除照片（需要认证）
router.delete('/:id', authMiddleware, (req: AuthRequest, res) => {
  const { id } = req.params

  const photo = db.prepare('SELECT * FROM photos WHERE id = ?').get(id) as
    | { image_url: string }
    | undefined

  if (!photo) {
    return res.status(404).json({ error: '照片不存在' })
  }

  // 删除文件
  const imagePath = path.join(__dirname, '..', '..', photo.image_url)
  if (fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath)
  }

  db.prepare('DELETE FROM photos WHERE id = ?').run(id)

  res.json({ message: '照片已删除' })
})

export default router
