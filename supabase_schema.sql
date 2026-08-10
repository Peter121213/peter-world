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
  lyrics text default '',
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

-- 6. 生活随笔表
create table if not exists blog_posts (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  content text default '',
  cover_image text default '',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 插入默认管理员账号（admin / admin123）
-- 密码 admin123 的 bcrypt 哈希值
insert into users (username, password_hash)
values (
  'admin',
  '$2a$10$IKAXlyyG07ddz7YmfU0SJOEjbW/8LLwAXNyXtbZal2qBV8lEgxRs.'
)
on conflict (username) do nothing;

-- 插入默认网站设置
insert into site_settings (key, value) values
  -- 基本设置
  ('site_name', 'Peter 的小世界'),
  ('site_description', '用镜头记录美好，用音乐传递情感'),
  ('nav_home', '首页'),
  ('nav_album', '相册'),
  ('nav_blog', '生活随笔'),
  ('nav_about', '关于我'),
  ('nav_contact', '联系我'),
  ('footer_copyright', '© 2024 Peter 的小世界. All rights reserved.'),

  -- 首页 - Hero 区域
  ('hero_badge', '欢迎来到我的小世界'),
  ('hero_title', '用镜头记录美好，\n用音乐传递情感'),
  ('hero_subtitle', '这里有一些我的生活碎片和喜欢的音乐\n随便坐坐，听听歌，看看照片'),
  ('hero_button1', '随便看看'),
  ('hero_button2', '关于我'),
  ('hero_image', ''),

  -- 首页 - 精选照片
  ('featured_photos_badge', 'Featured Photos'),
  ('featured_photos_title', '精选照片'),
  ('featured_photos_desc', '一些我觉得还不错的照片，记录生活中的小美好'),
  ('featured_photos_view_all', '查看全部照片'),

  -- 首页 - 最近随笔
  ('recent_posts_badge', 'Recent Posts'),
  ('recent_posts_title', '最近随笔'),
  ('recent_posts_desc', '随便写写，记录一下生活'),
  ('recent_posts_view_all', '查看全部随笔'),

  -- 首页 - 音乐区域
  ('music_badge', 'Music'),
  ('music_section_title', '音乐陪伴'),
  ('music_section_description', '每一张照片都有它的故事，每一首歌都有它的心情。\n点击右下角的音乐按钮，开启你的听觉之旅。'),
  ('music_button', '播放音乐'),

  -- 首页 - 关于我预览
  ('about_title', '关于我'),
  ('about_content', '你好，我是 Peter，一个热爱摄影和音乐的普通人。\n我喜欢用镜头记录生活中的美好瞬间，也喜欢用音乐表达内心的情感。\n\n这个小世界是我分享作品和心情的地方，\n希望你能在这里找到一些共鸣和感动。'),
  ('about_image', ''),
  ('about_preview_button', '了解更多'),

  -- 相册页面
  ('album_badge', 'Album'),
  ('album_title', '相册'),
  ('album_desc', '随手拍的一些照片，记录生活中的点点滴滴\n随便看看吧～'),
  ('album_category_all', '全部'),
  ('album_category_1', '风景'),
  ('album_category_2', '人像'),
  ('album_category_3', '美食'),
  ('album_category_4', '小动物'),
  ('album_category_5', '其他'),
  ('album_empty', '还没有照片～'),

  -- 生活随笔页面
  ('blog_badge', 'Blog'),
  ('blog_title', '生活随笔'),
  ('blog_desc', '记录生活中的点点滴滴，一些想法，一些感受'),
  ('blog_empty', '还没有写过随笔～'),

  -- 关于我页面
  ('about_badge', 'About Me'),
  ('about_page_desc', '一个普通的打工人，\n在这里记录我的生活和一些碎碎念'),
  ('about_location', '中国 · 成都'),
  ('about_love', '热爱生活'),
  ('about_button', '联系我'),
  ('about_page_image', ''),

  -- 关于我页面 - 健身板块
  ('fitness_badge', 'Fitness'),
  ('fitness_title', '关于健身'),
  ('fitness_desc', '健身 5 年多了，从一个胖子慢慢瘦了下来。\n虽然现在练得还是不怎么样，但是一直在坚持的路上～'),
  ('fitness_tag_1', '健身 5 年+'),
  ('fitness_tag_2', '瘦掉 25kg 肉'),
  ('fitness_tag_3', '减肥一只在路上之人'),
  ('fitness_tag_4', '永远练不起来之人'),
  ('fitness_tag_5', '有氧爱好者'),
  ('fitness_photos_placeholder', '健身照片区域（以后可以在这里放健身照片）'),

  -- 关于我页面 - 兴趣爱好
  ('hobbies_title', '兴趣爱好'),
  ('hobby_1', '音乐'),
  ('hobby_2', '电影'),
  ('hobby_3', '游戏'),
  ('hobby_4', '美食'),
  ('hobby_5', '旅行'),
  ('hobby_6', '健身'),

  -- 联系页面
  ('contact_badge', 'Contact'),
  ('contact_title', '联系我'),
  ('contact_desc', '有什么想说的，都可以在这里告诉我～'),
  ('contact_email', '2309031942@qq.com'),
  ('contact_name_placeholder', '你的名字'),
  ('contact_email_placeholder', '你的邮箱'),
  ('contact_message_placeholder', '想说点什么...'),
  ('contact_button', '发送消息'),
  ('contact_success', '消息发送成功！我会尽快回复你的～'),

  -- 社交链接
  ('social_weibo', ''),
  ('social_instagram', ''),
  ('social_x', ''),
  ('social_github', ''),

  -- 访问统计（总访问量 + 近 7 天每日 JSON）
  ('visit_count', '0'),
  ('visit_daily', '{}')
on conflict (key) do nothing;

-- 已有库升级：为音乐表增加歌词字段（新库建表已包含，可重复执行）
alter table music_tracks add column if not exists lyrics text default '';
