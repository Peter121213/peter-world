import os

settings_path = 'E:/桌面/peter-world/frontend/src/pages/admin/Settings.tsx'
with open(settings_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 查找 handleSave 函数
idx = content.find('handleSave')
if idx > -1:
    print('找到 handleSave，位置：', idx)
    print(content[idx:idx+2000])
else:
    print('没找到 handleSave')
