import os

# 读取 login.js 的内容
login_path = 'E:/桌面/peter-world/api/auth/login.js'
with open(login_path, 'r', encoding='utf-8') as f:
    login_content = f.read()

# 读取 verify.js 的内容
verify_path = 'E:/桌面/peter-world/api/auth/verify.js'
with open(verify_path, 'r', encoding='utf-8') as f:
    verify_content = f.read()

print('login.js 开头：')
print(login_content[:500])
print()
print('verify.js 内容：')
print(verify_content)
