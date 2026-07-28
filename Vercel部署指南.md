# Vercel 部署指南 - 方案一（全 Vercel 方案）

本方案使用 **Vercel + Supabase + Cloudflare R2**，全部免费，不需要信用卡。

## 📋 架构说明

```
用户访问 → Vercel（前端 + 后端 API）
              ↓
        ┌─────┴─────┐
        ↓           ↓
    Supabase     Cloudflare R2
   （数据库）    （文件存储）
```

- **前端**：Vercel 静态托管
- **后端 API**：Vercel Serverless Functions
- **数据库**：Supabase PostgreSQL（免费 500MB）
- **文件存储**：Cloudflare R2（免费 10GB）

---

## 🚀 部署步骤

### 第一步：初始化 Supabase 数据库

1. 打开 Supabase 项目：https://supabase.com/dashboard
2. 进入你的项目
3. 点击左边菜单的 **"SQL Editor"**（SQL 编辑器）
4. 点击 **"New query"** 新建查询
5. 把 `supabase_schema.sql` 文件里的内容全部复制粘贴进去
6. 点击 **"Run"** 执行

执行成功后，数据库表就创建好了，默认管理员账号也初始化了：
- 用户名：`admin`
- 密码：`admin123`

---

### 第二步：把代码推送到 GitHub

在项目目录下打开命令行，执行：

```bash
git add .
git commit -m "改造为 Vercel Serverless Functions 版本"
git push
```

---

### 第三步：在 Vercel 导入项目

1. 打开 Vercel：https://vercel.com/new
2. 用 GitHub 登录
3. 找到你的 `peter-world` 仓库，点击 **"Import"**

#### 配置项目：

- **Project Name**：随便起，比如 `peter-world`
- **Framework Preset**：Vite（应该会自动检测到）
- **Root Directory**：**保持默认（根目录）**，不要改！

⚠️ 重要：Root Directory 一定要是项目根目录，不要选 frontend！

---

### 第四步：配置环境变量

在 Vercel 导入页面，找到 **"Environment Variables"** 部分，添加以下环境变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `SUPABASE_URL` | `https://wazzplbesvoimcrymkz.supabase.co` | 你的 Supabase 项目 URL |
| `SUPABASE_SERVICE_ROLE_KEY` | 你的 service_role key | Supabase 服务端密钥 |
| `R2_ACCOUNT_ID` | 你的 Cloudflare 账户 ID | 在 Cloudflare 首页 URL 里能看到 |
| `R2_ACCESS_KEY_ID` | 你的 R2 Access Key ID | 之前创建的 API Token 的 ID |
| `R2_SECRET_ACCESS_KEY` | 你的 R2 Secret Access Key | 之前创建的 API Token 的密钥 |
| `R2_BUCKET_NAME` | `peter-world-uploads` | 你的存储桶名称 |
| `JWT_SECRET` | 随便写一串复杂字符 | 加密用的密钥 |

一个一个添加，全部加完。

---

### 第五步：部署

所有配置都填好后，点击 **"Deploy"** 按钮开始部署！

等待 2-3 分钟，部署成功后你会得到一个域名，比如：
`https://peter-world.vercel.app`

现在你就可以访问网站了！

---

### 第六步：绑定你的域名 peter16.top

#### 1. 在 Vercel 添加域名

1. 进入 Vercel 项目页面
2. 点击 **"Settings"** → **"Domains"**
3. 输入你的域名：`peter16.top`
4. 点击 "Add"

#### 2. 在阿里云配置 DNS 解析

1. 打开阿里云域名控制台：https://dc.console.aliyun.com/
2. 找到你的域名 `peter16.top`，点击 "解析"
3. 添加以下记录：

**记录 1 - 主域名：**
- 记录类型：`CNAME`
- 主机记录：`@`
- 记录值：Vercel 给你的那个地址（比如 `peter-world.vercel.app`）
- TTL：`10分钟`

**记录 2 - www 子域名：**
- 记录类型：`CNAME`
- 主机记录：`www`
- 记录值：Vercel 给你的那个地址
- TTL：`10分钟`

#### 3. 等待生效

DNS 解析生效需要几分钟到几小时。回到 Vercel 的 Domains 页面，等状态变成 "Valid" 就成功了！

Vercel 会自动配置 HTTPS 证书。

---

## ✅ 完成！

现在你可以通过以下地址访问你的网站：

- 主域名：https://peter16.top
- www 域名：https://www.peter16.top
- Vercel 备用地址：https://xxx.vercel.app
- 后台地址：https://peter16.top/admin
- 默认账号：admin / admin123（记得改密码！）

---

## 📝 本地开发

如果你想在本地开发：

### 方式一：用 Vercel CLI（推荐，最接近生产环境）

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 启动开发环境
vercel dev
```

### 方式二：用原来的 Express 后端（简单）

```bash
# 启动后端
cd backend
npm run dev

# 启动前端（另开一个终端）
cd frontend
npm run dev
```

访问 http://127.0.0.1:5173

---

## ❓ 常见问题

**Q: 上传图片/音乐失败？**
A: 检查 R2 的环境变量是否配置正确，特别是 Access Key ID 和 Secret Access Key。

**Q: 后台登录失败？**
A: 检查 Supabase 数据库是否初始化了，users 表里有没有 admin 用户。

**Q: 国内访问速度慢？**
A: Vercel 在国内访问速度一般。如果追求速度，可以考虑用国内 CDN 加速。

**Q: 会不会扣费？**
A: 只要不超出免费额度就不会扣费：
- Vercel：每月 100GB 流量，个人网站完全够用
- Supabase：500MB 数据库，5GB 带宽
- Cloudflare R2：10GB 存储，100GB 流出流量

---

## 🔒 安全建议

1. **修改默认管理员密码**：部署后第一时间登录后台改密码
2. **JWT_SECRET 要复杂**：不要用简单的字符串
3. **不要把密钥提交到 GitHub**：.env 文件已经在 .gitignore 里了
