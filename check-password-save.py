import os

settings_path = 'E:/桌面/peter-world/frontend/src/pages/admin/Settings.tsx'
with open(settings_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 查找 password 标签页的保存逻辑
idx = content.find("activeTab === 'password'")
if idx > -1:
    print('找到 password 保存逻辑，位置：', idx)
    print(content[idx:idx+1500])
