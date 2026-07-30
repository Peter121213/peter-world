import os

# 删除单独的 reorder.js 文件
photos_reorder_path = 'E:/桌面/peter-world/api/photos/reorder.js'
music_reorder_path = 'E:/桌面/peter-world/api/music/reorder.js'

if os.path.exists(photos_reorder_path):
    os.remove(photos_reorder_path)
    print('删除 photos/reorder.js 成功')

if os.path.exists(music_reorder_path):
    os.remove(music_reorder_path)
    print('删除 music/reorder.js 成功')

# 修改前端 API 路径，改回 /photos 和 /music
api_path = 'E:/桌面/peter-world/frontend/src/lib/api.ts'
with open(api_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 改回照片排序路径
content = content.replace("request('/photos/reorder', {", "request('/photos', {")

# 改回音乐排序路径
content = content.replace("request('/music/reorder', {", "request('/music', {")

with open(api_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('前端API路径改回成功')
