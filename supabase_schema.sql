-- ============================================
-- Peter 的小世界 - 数据库表结构
-- 在 Supabase SQL Editor 中执行此脚本
-- ============================================

-- 启用 UUID 扩展（如果需要）
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. 用户表
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. 照片表
-- ============================================
CREATE TABLE IF NOT EXISTS photos (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  image_url TEXT NOT NULL,
  category TEXT DEFAULT '风景',
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. 音乐表
-- ============================================
CREATE TABLE IF NOT EXISTS music_tracks (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT DEFAULT 'Peter',
  audio_url TEXT NOT NULL,
  cover_url TEXT,
  duration TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. 网站设置表
-- ============================================
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT
);

-- ============================================
-- 5. 联系留言表
-- ============================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 初始化默认管理员账号
-- 默认用户名：admin
-- 默认密码：admin123
-- （bcrypt 加密后的哈希值）
-- ============================================
INSERT INTO users (username, password_hash)
VALUES (
  'admin',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'
)
ON CONFLICT (username) DO NOTHING;

-- ============================================
-- 初始化默认网站设置
-- ============================================
INSERT INTO site_settings (key, value) VALUES
  ('site_name', 'Peter 的小世界'),
  ('site_description', '记录生活，分享美好'),
  ('about_title', '关于我'),
  ('about_content', '你好，我是 Peter，一个热爱生活的人。这里记录着我的点滴日常。'),
  ('contact_email', '2309031942@qq.com'),
  ('social_instagram', ''),
  ('social_twitter', ''),
  ('social_github', ''),
  ('social_weibo', '')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- 创建一些示例数据（可选，取消注释即可使用）
-- ============================================

-- 示例照片
-- INSERT INTO photos (title, description, image_url, category, is_featured) VALUES
--   ('示例照片 1', '这是一张示例照片', 'https://picsum.photos/seed/photo1/800/600', '风景', true),
--   ('示例照片 2', '这是一张示例照片', 'https://picsum.photos/seed/photo2/800/600', '人像', true),
--   ('示例照片 3', '这是一张示例照片', 'https://picsum.photos/seed/photo3/800/600', '街拍', false);

-- 示例音乐
-- INSERT INTO music_tracks (title, artist, audio_url, duration) VALUES
--   ('示例音乐 1', 'Peter', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', '3:45'),
--   ('示例音乐 2', 'Peter', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', '4:20');

-- ============================================
-- 完成！
-- ============================================
