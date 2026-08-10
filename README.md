# Peter 的小世界

个人作品集网站：前台展示 + 可视化管理后台。

部署架构：**Vercel（前端 + Serverless API）+ Supabase（数据库）+ Cloudflare R2（文件存储）**。

## 功能

### 前台
- 首页：Hero、精选照片、最近随笔、音乐介绍、关于我预览
- 相册：分类筛选、网格展示、灯箱查看
- 生活随笔：文章列表与阅读
- 关于我 / 联系我
- 右下角悬浮音乐播放器（播放列表、音量控制）

### 管理后台（`/admin`）
- 仪表盘：数据概览与快捷入口
- 照片管理：上传、编辑、删除、精选、排序、分类
- 音乐管理：上传、删除、排序、预览
- 随笔管理：发布与编辑
- 网站设置：文案、社交链接、改密等

默认管理员：`admin` / `admin123`（部署后请立刻修改）

## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | React 18、TypeScript、Vite、Tailwind CSS、Framer Motion、React Router |
| API | Vercel Serverless Functions（`api/`） |
| 数据库 | Supabase（PostgreSQL） |
| 文件存储 | Cloudflare R2（S3 兼容） |
| 认证 | JWT（Cookie / `X-Auth-Token`） |

## 项目结构

```
peter-world/
├── frontend/                 # Vite + React 前端
│   ├── src/
│   │   ├── components/       # 公共组件
│   │   ├── pages/            # 前台页面
│   │   │   └── admin/        # 管理后台
│   │   ├── contexts/         # Settings 等上下文
│   │   ├── lib/              # API 封装、工具函数
│   │   └── types/            # TypeScript 类型
│   └── ...
├── api/                      # Vercel Serverless API
│   ├── _lib/                 # 共用：auth / supabase / r2 / response
│   ├── auth/                 # 登录、改密
│   ├── photos/               # 照片
│   ├── music/                # 音乐
│   ├── blog/                 # 随笔
│   ├── contact/              # 留言
│   ├── files/                # R2 文件代理
│   └── settings.js           # 网站设置
├── supabase_schema.sql       # 数据库初始化 SQL
├── vercel.json               # 构建、重写、函数配置
├── .env.example              # 服务端环境变量模板
└── Vercel部署指南.md         # 详细部署步骤
```

## 快速开始

### 前置要求
- Node.js 18+
- npm
- Supabase 项目（已执行 `supabase_schema.sql`）
- Cloudflare R2 存储桶与 API Token（本地跑上传相关功能时需要）

### 1. 安装依赖

```bash
# 根目录：API 运行时依赖（Supabase、R2、JWT 等）
npm install

# 前端
cd frontend
npm install
```

### 2. 配置环境变量

复制根目录 `.env.example` 为 `.env`（或在 Vercel 项目设置中配置）：

```env
SUPABASE_URL=https://你的项目.supabase.co
SUPABASE_SERVICE_ROLE_KEY=你的 service_role 密钥

R2_ACCOUNT_ID=你的 Cloudflare 账户 ID
R2_ACCESS_KEY_ID=你的 R2 Access Key ID
R2_SECRET_ACCESS_KEY=你的 R2 Secret Access Key
R2_BUCKET_NAME=peter-world-uploads

JWT_SECRET=请换成足够长的随机字符串
```

前端一般不需要单独配置 API 地址；同域部署时请求走 `/api`。本地若要指定远端 API，可在 `frontend/.env` 中设置：

```env
VITE_API_URL=https://你的域名/api
```

### 3. 初始化数据库

在 Supabase → SQL Editor 中执行项目根目录的 `supabase_schema.sql`。

### 4. 本地开发

推荐用 Vercel CLI，这样前端与 `api/` 函数一起跑：

```bash
npm i -g vercel
vercel dev
```

也可只起前端（`cd frontend && npm run dev`），此时 `/api` 需指向已部署的后端，或自行用 `vercel dev` 起 API。

- 前台：http://localhost:5173（或 CLI 提示的端口）
- 后台：http://localhost:5173/admin

## 部署

全站部署到 **Vercel**（Root Directory 保持仓库根目录，不要只选 `frontend`）。

环境变量与域名绑定等细节见：[Vercel部署指南.md](./Vercel部署指南.md)

`vercel.json` 已配置：
- 构建：`cd frontend && npm run build`
- 输出：`frontend/dist`
- API 重写与函数区域（`hnd1`）

## 数据库表

| 表 | 说明 |
|---|---|
| `users` | 管理员 |
| `photos` | 照片 |
| `music_tracks` | 音乐 |
| `blog_posts` | 生活随笔 |
| `site_settings` | 网站设置（键值对） |
| `contact_messages` | 联系留言 |

## 自定义

- **主题色**：编辑 `frontend/tailwind.config.js` 中的 `colors`
- **页面文案**：后台「网站设置」，或直接改 `site_settings` 表
- **管理员密码**：后台设置页修改；切勿长期使用默认密码

## 注意事项

1. 部署前务必更换 `JWT_SECRET` 与默认管理员密码
2. `SUPABASE_SERVICE_ROLE_KEY` 仅放在服务端环境变量，不要暴露到前端
3. 上传图片建议先压缩，单张不宜过大
4. 定期在 Supabase / R2 侧做好数据与文件备份

## License

MIT
