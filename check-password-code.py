import os

settings_path = 'E:/桌面/peter-world/frontend/src/pages/admin/Settings.tsx'
with open(settings_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 查找修改密码相关的代码
idx = content.find('修改密码')
if idx > -1:
    print('找到修改密码相关代码，位置：', idx)
    print(content[idx-200:idx+1000])
else:
    print('没找到修改密码')
    # 找找 password
    idx = content.find('password')
    if idx > -1:
        print('找到 password，位置：', idx)
        print(content[idx-100:idx+500])
