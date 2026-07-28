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
    const uploadDir = path.join(__dirname, '..', '..', 'uploads', 'music')
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
    fileSize: 20 * 1024 * 1024, // 20MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /mp3|wav|ogg|m4a|aac/i
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    )
    const mimetype = /audio\//i.test(file.mimetype)

    if (extname && mimetype) {
      return cb(null, true)
    } else {
      cb(new Error('只允许上传音频文件'))
    }
  },
})

// 获取所有音乐
router.get('/', (req, res) => {
  const tracks = db
    .prepare('SELECT * FROM music_tracks ORDER BY created_at DESC')
    .all()

  res.json({ tracks })
})

// 获取单首音乐
router.get('/:id', (req, res) => {
  const { id } = req.params

  const track = db
    .prepare('SELECT * FROM music_tracks WHERE id = ?')
    .get(id)

  if (!track) {
    return res.status(404).json({ error: '音乐不存在' })
  }

  res.json({ track })
})

// 上传音乐（需要认证）
router.post(
  '/',
  authMiddleware,
  upload.single('audio'),
  (req: AuthRequest, res) => {
    const { title, artist, duration } = req.body

    if (!title) {
      return res.status(400).json({ error: '请提供歌曲标题' })
    }

    if (!req.file) {
      return res.status(400).json({ error: '请上传音频文件' })
    }

    const audioUrl = `/uploads/music/${req.file.filename}`

    const result = db
      .prepare(
        'INSERT INTO music_tracks (title, artist, audio_url, duration) VALUES (?, ?, ?, ?)'
      )
      .run(title, artist || 'Peter', audioUrl, duration || '')

    const track = db
      .prepare('SELECT * FROM music_tracks WHERE id = ?')
      .get(result.lastInsertRowid)

    res.status(201).json({ track })
  }
)

// 更新音乐（需要认证）
router.put('/:id', authMiddleware, (req: AuthRequest, res) => {
  const { id } = req.params
  const { title, artist, duration } = req.body

  const track = db.prepare('SELECT * FROM music_tracks WHERE id = ?').get(id)

  if (!track) {
    return res.status(404).json({ error: '音乐不存在' })
  }

  db.prepare(
    `UPDATE music_tracks SET 
      title = COALESCE(?, title),
      artist = COALESCE(?, artist),
      duration = COALESCE(?, duration)
    WHERE id = ?`
  ).run(title || null, artist || null, duration || null, id)

  const updatedTrack = db
    .prepare('SELECT * FROM music_tracks WHERE id = ?')
    .get(id)

  res.json({ track: updatedTrack })
})

// 删除音乐（需要认证）
router.delete('/:id', authMiddleware, (req: AuthRequest, res) => {
  const { id } = req.params

  const track = db.prepare('SELECT * FROM music_tracks WHERE id = ?').get(id) as
    | { audio_url: string }
    | undefined

  if (!track) {
    return res.status(404).json({ error: '音乐不存在' })
  }

  // 删除文件
  const audioPath = path.join(__dirname, '..', '..', track.audio_url)
  if (fs.existsSync(audioPath)) {
    fs.unlinkSync(audioPath)
  }

  db.prepare('DELETE FROM music_tracks WHERE id = ?').run(id)

  res.json({ message: '音乐已删除' })
})

export default router
