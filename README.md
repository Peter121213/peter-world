# Peter 的小世界

一个个人作品集网站，包含前端展示页面和可视化管理后台。

## 项目简介

这是一个基于 React + Node.js + SQLite 的个人网站项目，包含：

- 🎨 **前端展示**：个人作品集网站，包含首页、作品集、关于我、联系我等页面
- 🎵 **音乐播放器**：右下角悬浮音乐播放器，支持播放列表
- 📸 **照片展示**：Bento Grid 布局、灯箱效果、分类筛选
- 🔐 **管理后台**：可视化管理界面，支持照片上传、音乐管理、网站设置
- 💾 **轻量数据库**：使用 SQLite，无需单独数据库服务

## 技术栈

### 前端
- React 18 + TypeScript
- Vite 构建工具
- Tailwind CSS 样式框架
- Framer Motion 动画库
- React Router 路由
- Lucide React 图标库

### 后端
- Node.js + Express
- SQLite 数据库 (better-sqlite3)
- JWT 身份认证
- Multer 文件上传
- bcrypt 密码加密

## 项目结构

```
peter-world/
├── frontend/              # 前端项目
│   ├── src/
│   │   ├── components/    # 组件
│   │   │   └── ui/        # UI组件
│   │   ├── pages/         # 页面
│   │   │   └── admin/     # 管理后台页面
│   │   ├── lib/           # 工具函数和API
│   │   ├── hooks/         # 自定义hooks
│   │   ├── types/         # 类型定义
│   │   ├── App.tsx        # 主应用组件
│   │   ├── main.tsx       # 入口文件
│   │   └── index.css      # 全局样式
│   ├── public/            # 静态资源
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── postcss.config.js
├── backend/               # 后端项目
│   ├── src/
│   │   ├── routes/        # 路由
│   │   ├── middleware/    # 中间件
│   │   ├── database.ts    # 数据库初始化
│   │   └── index.ts       # 入口文件
│   ├── uploads/           # 上传的文件
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
└── README.md
```

## 快速开始

### 前置要求
- Node.js 18+
- npm 或 yarn

### 1. 安装依赖

#### 前端
```bash
cd frontend
npm install
```

#### 后端
```bash
cd backend
npm install
```

### 2. 配置环境变量

后端 `.env` 文件（已默认创建）：
```
PORT=3001
JWT_SECRET=peter-world-secret-key-2024
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

### 3. 启动开发服务器

#### 启动后端
```bash
cd backend
npm run dev
```
后端将运行在 http://localhost:3001

#### 启动前端
```bash
cd frontend
npm run dev
```
前端将运行在 http://localhost:5173

### 4. 访问网站

- 前台首页：http://localhost:5173
- 管理后台：http://localhost:5173/admin
- 默认账号：admin / admin123

## 功能说明

### 前台功能
- 🏠 **首页**：Hero 大图、精选作品、音乐介绍、关于我预览
- 📸 **作品集**：分类筛选、照片网格、灯箱查看
- 👤 **关于我**：个人介绍、技能展示、时间线、装备清单
- 📮 **联系我**：联系表单、社交媒体链接
- 🎵 **音乐播放器**：右下角悬浮，支持播放/暂停、上一首/下一首、音量控制

### 管理后台功能
- 📊 **仪表盘**：数据统计、最近活动、快捷操作
- 🖼️ **照片管理**：上传、删除、编辑、设为精选、分类筛选、搜索
- 🎵 **音乐管理**：上传、删除、播放预览
- ⚙️ **网站设置**：基本设置、个人资料、社交链接、修改密码

## 部署指南

### 方案一：Vercel + Render（推荐）

#### 前端部署到 Vercel
1. 将项目推送到 GitHub
2. 在 Vercel 导入项目
3. 构建命令：`npm run build`
4. 输出目录：`dist`
5. 配置环境变量（API 地址等）

#### 后端部署到 Render
1. 在 Render 创建 Web Service
2. 连接 GitHub 仓库
3. 构建命令：`cd backend && npm install && npm run build`
4. 启动命令：`cd backend && npm start`
5. 配置环境变量

### 方案二：本地服务器部署

```bash
# 构建前端
cd frontend
npm run build

# 构建后端
cd ../backend
npm run build

# 使用 pm2 或 systemd 运行后端
npm install -g pm2
pm2 start dist/index.js --name peter-world
```

## 数据库说明

项目使用 SQLite 数据库，数据库文件会在首次运行时自动创建在 `backend/database.sqlite`。

### 数据表
- `users` - 管理员用户
- `photos` - 照片数据
- `music_tracks` - 音乐数据
- `site_settings` - 网站设置（键值对）
- `contact_messages` - 联系留言

## 自定义配置

### 修改主题色
编辑 `frontend/tailwind.config.js` 中的 `colors` 配置：
```js
primary: {
  DEFAULT: '#E8893F',  // 修改这里
  foreground: '#FFFFFF',
}
```

### 修改默认管理员密码
编辑 `backend/.env` 文件：
```
ADMIN_USERNAME=你的用户名
ADMIN_PASSWORD=你的密码
```

## 注意事项

1. **安全**：部署前请务必修改默认管理员密码和 JWT 密钥
2. **存储**：上传的文件保存在 `backend/uploads` 目录，定期备份
3. **性能**：图片建议压缩后上传，单张不超过 5MB
4. **备份**：定期备份 `database.sqlite` 数据库文件

## 开发说明

### 添加新页面
1. 在 `frontend/src/pages/` 创建页面组件
2. 在 `frontend/src/App.tsx` 添加路由

### 添加新 API
1. 在 `backend/src/routes/` 创建路由文件
2. 在 `backend/src/index.ts` 注册路由
3. 在 `frontend/src/lib/api.ts` 添加前端调用

## License

MIT
