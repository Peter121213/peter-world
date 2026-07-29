-- 启用 UUID 扩展
create extension if not exists "uuid-ossp";

-- 1. 用户表（管理员）
create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  username text unique not null,
  password_hash text not null,
  created_at timestamp with time zone default now()
);

-- 2. 照片表
create table if not exists photos (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text default '',
  image_url text not null,
  category text default '风景',
  is_featured boolean default false,
  created_at timestamp with time zone default now()
);

-- 3. 音乐表
create table if not exists music_tracks (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  artist text default '',
  audio_url text not null,
  cover_url text,
  duration integer default 0,
  created_at timestamp with time zone default now()
);

-- 4. 网站设置表（key-value 结构）
create table if not exists site_settings (
  id uuid primary key default uuid_generate_v4(),
  key text unique not null,
  value text default '',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 5. 联系留言表
create table if not exists contact_messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamp with time zone default now()
);

-- 插入默认管理员账号（admin / admin123）
-- 密码 admin123 的 bcrypt 哈希值
insert into users (username, password_hash)
values (
  'admin',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'
)
on conflict (username) do nothing;

-- 插入默认网站设置
insert into site_settings (key, value) values
  ('site_name', 'Peter 的小世界'),
  ('site_description', '用镜头记录美好，用音乐传递情感'),
  ('hero_title', '用镜头记录美好，\n用音乐传递情感'),
  ('hero_subtitle', '这里有一些我的生活碎片和喜欢的音乐\n随便坐坐，听听歌，看看照片'),
  ('hero_image', 'https://picsum.photos/seed/hero/1920/1080'),
  ('about_title', '关于我'),
  ('about_content', '你好，我是 Peter，一个热爱摄影和音乐的普通人。\n我喜欢用镜头记录生活中的美好瞬间，也喜欢用音乐表达内心的情感。\n\n这个小世界是我分享作品和心情的地方，\n希望你能在这里找到一些共鸣和感动。'),
  ('about_image', 'https://picsum.photos/seed/about/600/600'),
  ('about_page_image', 'https://picsum.photos/seed/aboutme/600/750'),
  ('contact_email', '2309031942@qq.com'),
  ('social_weibo', ''),
  ('social_instagram', ''),
  ('social_x', ''),
  ('social_github', ''),
  ('music_section_title', '音乐陪伴'),
  ('music_section_description', '每一张照片都有它的故事，每一首歌都有它的心情。\n点击右下角的音乐按钮，开启你的听觉之旅。')
on conflict (key) do nothing;
