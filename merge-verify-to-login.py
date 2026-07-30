import os

login_path = 'E:/桌面/peter-world/api/auth/login.js'
with open(login_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 导入 verifyAuth
old_import = "import { generateToken } from '../_lib/auth'"
new_import = "import { generateToken, verifyAuth } from '../_lib/auth'"

if old_import in content:
    content = content.replace(old_import, new_import)
    print('导入 verifyAuth 成功')
else:
    print('没找到导入语句')

# 在 POST 方法前面加上 GET 方法（验证 token）
old_post_check = "  if (req.method !== 'POST') {\n    return error(res, '方法不允许', 405)\n  }"

new_get_and_post = """  // GET - 验证 token
  if (req.method === 'GET') {
    const user = verifyAuth(req)

    if (!user) {
      return error(res, '无效的 token', 401)
    }

    return success(res, {
      valid: true,
      user: {
        id: user.userId,
        username: user.username,
      },
    })
  }

  // POST - 登录
  if (req.method !== 'POST') {
    return error(res, '方法不允许', 405)
  }"""

if old_post_check in content:
    content = content.replace(old_post_check, new_get_and_post)
    print('添加 GET 方法成功')
else:
    print('没找到 POST 检查')
    # 看看实际的内容
    idx = content.find("req.method !== 'POST'")
    if idx > -1:
        print('找到 POST 检查位置:', idx)
        print(content[idx-50:idx+100])

# 保存文件
with open(login_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('login.js 修改完成')

# 删除 verify.js
verify_path = 'E:/桌面/peter-world/api/auth/verify.js'
if os.path.exists(verify_path):
    os.remove(verify_path)
    print('删除 verify.js 成功')
