import Database from 'better-sqlite3'
import path from 'path'
import bcrypt from 'bcryptjs'

const dbPath = path.join(__dirname, '..', 'database.sqlite')
const db = new Database(dbPath)

// 初始化数据库表
export function initDatabase() {
  // 用户表
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // 照片表
  db.exec(`
    CREATE TABLE IF NOT EXISTS photos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      image_url TEXT NOT NULL,
      category TEXT DEFAULT '风景',
      is_featured INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // 音乐表
  db.exec(`
    CREATE TABLE IF NOT EXISTS music_tracks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      artist TEXT DEFAULT 'Peter',
      audio_url TEXT NOT NULL,
      cover_url TEXT,
      duration TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // 网站设置表（键值对存储）
  db.exec(`
    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT
    )
  `)

  // 联系留言表
  db.exec(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // 初始化默认管理员
  const adminUsername = process.env.ADMIN_USERNAME || 'admin'
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

  const existingUser = db
    .prepare('SELECT id FROM users WHERE username = ?')
    .get(adminUsername)

  if (!existingUser) {
    const passwordHash = bcrypt.hashSync(adminPassword, 10)
    db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)').run(
      adminUsername,
      passwordHash
    )
    console.log(`已创建默认管理员账号: ${adminUsername}`)
  }

  // 初始化默认设置
  const defaultSettings: Record<string, string> = {
    siteName: 'Peter 的小世界',
    siteDescription: '用镜头记录美好，用音乐传递情感',
    heroTitle: '欢迎来到我的小世界',
    heroSubtitle: '这里有一些我的生活碎片和喜欢的音乐\n随便坐坐，听听歌，看看照片',
    aboutTitle: '关于我',
    aboutContent:
      '你好，我是 Peter，一个热爱摄影和音乐的普通人。我喜欢用镜头记录生活中的美好瞬间，也喜欢用音乐表达内心的情感。',
    location: '中国 · 成都',
    email: 'hello@peter.world',
    socialWeibo: '',
    socialInstagram: '',
    socialTwitter: '',
    socialGithub: '',
  }

  const insertSetting = db.prepare(
    'INSERT OR IGNORE INTO site_settings (key, value) VALUES (?, ?)'
  )

  Object.entries(defaultSettings).forEach(([key, value]) => {
    insertSetting.run(key, value)
  })

  console.log('数据库初始化完成')
}

export default db
